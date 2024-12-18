// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

const Fs = require('fs');
const Bcrypt = require('bcrypt');
const CookieParser = require('cookie-parser');
const Passport = require('passport');
const Jwt = require('jsonwebtoken');
const Uuid = require('uuid');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '1w';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

const strategies = [];

const ensureSecurityTables = async function (knex, securityOptions) {
  try {
    const versionControl = await knex.select('security_version_number as securityVersionNumber').from('version_control').first();
    if (versionControl && versionControl.securityVersionNumber === 1) {
      return;
    }
  }
  catch (err) {
  }
  console.log('Adding Security Structure...');
  if (securityOptions.enableByUserPassword) {
    if (!(await knex.schema.hasColumn('users', 'hashed_password'))) {
      await knex.schema.table('users', function (knexTable) {
        knexTable.string('hashed_password', 400).nullable();
      })
    }
    if (!(await knex.schema.hasColumn('users', 'must_change_password'))) {
      await knex.schema.table('users', function (knexTable) {
        knexTable.boolean('must_change_password').nullable();
      })
    }
  }
  if (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) {
    if (!(await knex.schema.hasColumn('users', 'provider_name'))) {
      await knex.schema.table('users', function (knexTable) {
        knexTable.string('provider_name', 80).nullable();
      })
    }
  }
  if (!(await knex.schema.hasColumn('users', 'blocked'))) {
    await knex.schema.table('users', function (knexTable) {
      knexTable.boolean('blocked').nullable();
    })
  }
  if (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) {
    if (!(await knex.schema.hasTable('authorizations'))) {
      await knex.schema.createTable('authorizations', function (knexTable) {
        knexTable.string('code', 40).primary();
        knexTable.integer('user_id').unsigned();
        knexTable.foreign('user_id').references('users.user_id');
        knexTable.datetime('due_datetime');
      });
    }
  }
  if (!(await knex.schema.hasTable('sessions'))) {
    await knex.schema.createTable('sessions', function (knexTable) {
      knexTable.string('code', 40).primary();
      knexTable.integer('user_id').unsigned();
      knexTable.foreign('user_id').references('users.user_id');
      knexTable.datetime('start_datetime');
      knexTable.datetime('end_datetime').nullable();
      knexTable.index('start_datetime');
    });
  }
  if (!(await knex.schema.hasColumn('version_control', 'security_version_number'))) {
    await knex.schema.table('version_control', function (knexTable) {
      knexTable.integer('security_version_number').unsigned();
    })
  }
  await knex('version_control').update({ security_version_number: 1 });
  console.log('Security Structure successfully added.');
}

const ensureAdminUser = async function (knex, securityOptions) {
  const adminUser = await knex
    .select('user_id')
    .from('users')
    .where('username', '=', ADMIN_USERNAME)
    .first();
  if (adminUser) {
    return;
  }
  console.log('Creating admin user...');
  const adminUserData = {
    username: ADMIN_USERNAME,
    first_name: 'Administrator',
    last_name: '',
    role: 'administrator'
  }
  if (securityOptions.enableByUserPassword) {
    adminUserData.hashed_password = await Bcrypt.hash(ADMIN_PASSWORD, 10);
    adminUserData.must_change_password = true;
  }
  else if (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) {
    adminUserData.provider_name = securityOptions.enableProvidersNames[0];
  }
  await knex('users').insert(adminUserData);
  console.log('Admin user successfully created.');
}

const isValidPassword = function (password) {
  if (password.length < 8) {
    return false;
  }
  let hasUppercase = false;
  let hasLowercase = false;
  let hasNumber = false;
  let hasSpecialChar = false;
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (char >= 'A' && char <= 'Z') {
      hasUppercase = true;
    }
    else if (char >= 'a' && char <= 'z') {
      hasLowercase = true;
    }
    else if (char >= '0' && char <= '9') {
      hasNumber = true;
    }
    else if ('!@#$%^&*()_+[]{}|;:\',.<>?/~`-='.includes(char)) {
      hasSpecialChar = true;
    }
    if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
      return true;
    }
  }
  return false;
}

const comparePassword = async function (password, hashedPassword) {
  return await Bcrypt.compare(password, hashedPassword);
}

const startSession = async function (knex, user, res) {
  const accessTokenPayload = {
    userId: user.userId,
    username: user.username,
    given_name: user.firstName,
    family_name: user.lastName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    refreshable: (REFRESH_TOKEN_SECRET !== null && REFRESH_TOKEN_SECRET !== undefined)
  };
  const accessToken = Jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
  if (REFRESH_TOKEN_SECRET) {
    const sessionCode = Uuid.v4();
    const refreshTokenPayload = {
      sessionCode: sessionCode
    };
    const refreshToken = Jwt.sign(refreshTokenPayload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
    const refreshTokenParsed = Jwt.decode(refreshToken);
    await knex('sessions')
      .insert({
        code: sessionCode,
        user_id: user.userId,
        start_datetime: new Date()
      });
    res.cookie(
      'refresh_token', 
      refreshToken, 
      {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: (refreshTokenParsed.exp - (Date.now() / 1000)) * 1000
      }
    );
  }
  res.send(JSON.stringify({ accessToken: accessToken }));
}

const getAccessToken = function (headers) {
  if (headers && headers.authorization) {
    const authParts = headers.authorization.split(' ');
    if (authParts.length === 2) {
      return authParts[1];
    }
  }
  return null;
}

const validateAccessToken = function (accessToken) {
  return new Promise(function (resolve, reject) {
    Jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          resolve(null);
        }
        else {
          resolve(decoded);
        }
      }
    );
  });
}

const validateRefreshToken = function (refreshToken) {
  return new Promise(function (resolve, reject) {
    Jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          resolve(null);
        }
        else {
          resolve(decoded);
        }
      }
    );
  });
}

module.exports = {
  initDatabase: async function (knex, roles) {
    const filesNamesStrategies = await Fs.promises.readdir('./security/strategies');
    filesNamesStrategies.forEach(fileNameStrategy => {
      strategies.push(require('./strategies/' + fileNameStrategy));
    });
    const securityOptions = {
      enableByUserPassword: strategies.some(strategy => strategy.providerName === null || strategy.providerName === undefined),
      enableProvidersNames: strategies.filter(strategy => strategy.providerName !== null && strategy.providerName !== undefined).map(strategy => strategy.providerName),
      roles: roles
    };
    await ensureSecurityTables(knex, securityOptions);
    await ensureAdminUser(knex, securityOptions);
  },
  initRoutes: async function (knex, apiRouter, roles) {
    apiRouter.use(CookieParser());
    const filesNamesStrategies = await Fs.promises.readdir('./security/strategies');
    filesNamesStrategies.forEach(fileNameStrategy => {
      strategies.push(require('./strategies/' + fileNameStrategy));
    });
    const securityOptions = {
      enableByUserPassword: strategies.some(strategy => strategy.providerName === null || strategy.providerName === undefined),
      enableProvidersNames: strategies.filter(strategy => strategy.providerName !== null && strategy.providerName !== undefined).map(strategy => strategy.providerName),
      roles: roles
    };
    // Main Configuration
    if (securityOptions.enableByUserPassword) {
      apiRouter.post('/auth/login', async function (req, res) {
        try {
          const { username, password } = req.body;
          let knexQuery = knex
            .select(
              'user_id as userId',
              'username',
              'first_name as firstName',
              'last_name as lastName',
              'email',
              'avatar',
              'role',
              'hashed_password as hashedPassword',
              'must_change_password as mustChangePassword'
            )
            .from('users')
            .where('username', '=', username)
            .whereNull('blocked');
          if (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) {
            knexQuery = knexQuery.whereNull('provider_name');
          }
          knexQuery = knexQuery.first();
          const user = await knexQuery;
          if (user === null || user === undefined) {
            res
              .status(404)
              .send({
                code: 404,
                message: 'Not Found',
                description: 'Invalid username or password'
              });
            return;
          }
          if (!(await comparePassword(password, user.hashedPassword))) {
            res
              .status(404)
              .send({
                code: 404,
                message: 'Not Found',
                description: 'Invalid username or password'
              });
            return;
          }
          if (user.mustChangePassword) {
            res.send(JSON.stringify({ mustChangePassword: true }));
            return;
          }
          await startSession(knex, user, res);
        }
        catch (err) {
          res
            .status(500)
            .send({
              code: 500,
              message: 'Internal Server Error',
              description: 'Something went wrong',
              translationKey: 'somethingWentWrong'
            });
          console.error(err);
        }
      });
      apiRouter.post('/auth/change-password', async function (req, res) {
        try {
          const { username, password, newPassword } = req.body;
          if (!isValidPassword(newPassword)) {
            res
              .status(400)
              .send({
                code: 400,
                message: 'Bad Request',
                description: 'Password must be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters'
              });
            return;
          }
          let knexQuery = knex
            .select(
              'user_id as userId',
              'hashed_password as hashedPassword',
              'must_change_password as mustChangePassword'
            )
            .from('users')
            .where('username', '=', username)
            .whereNull('blocked');
          if (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) {
            knexQuery = knexQuery.whereNull('provider_name');
          }
          knexQuery = knexQuery.first();
          const user = await knexQuery;
          if (user === null || user === undefined) {
            res
              .status(404)
              .send({
                code: 404,
                message: 'Not Found',
                description: 'Invalid username or password'
              });
            return;
          }
          if (!(await comparePassword(password, user.hashedPassword)) || !user.mustChangePassword) {
            res
              .status(404)
              .send({
                code: 404,
                message: 'Not Found',
                description: 'Invalid username or password'
              });
            return;
          }
          await knex('users')
            .where('user_id', '=', user.userId)
            .update({
              hashed_password: (await Bcrypt.hash(newPassword, 10)),
              must_change_password: null
            });
          res.send(JSON.stringify({}));
        }
        catch (err) {
          res
            .status(500)
            .send({
              code: 500,
              message: 'Internal Server Error',
              description: 'Something went wrong',
              translationKey: 'somethingWentWrong'
            });
          console.error(err);
        }
      });
    }
    if (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) {
      for (const strategy of strategies) {
        const passportHandler = strategy.getPassportHandler(process.env.FRONT_URL + '/api');
        if (passportHandler) {
          Passport.use(passportHandler);
        }
      }
      apiRouter.use(Passport.initialize());
      for (const strategy of strategies) {
        strategy.addPassportRoutes(
          apiRouter,
          async function (payload, res) {
            const user = await knex
              .select('user_id as userId')
              .from('users')
              .where('username', '=', payload.username)
              .where('provider_name', '=', strategy.providerName)
              .whereNull('blocked')
              .first();
            if (user === null || user === undefined) {
              res
                .status(404)
                .send({
                  code: 404,
                  message: 'Not Found',
                  description: 'Invalid user'
                });
              return;
            }
            await knex('users')
              .where('user_id', '=', user.userId)
              .update({
                first_name: payload.given_name,
                last_name: payload.family_name,
                avatar: payload.avatar
              });
            const authenticationCode = Uuid.v4();
            const dueDatetime = new Date();
            dueDatetime.setSeconds(dueDatetime.getSeconds() + 10);
            await knex('authorizations')
              .where('user_id', '=', user.userId)
              .delete();
            await knex('authorizations')
              .insert({
                code: authenticationCode,
                user_id: user.userId,
                due_datetime: dueDatetime
              });
            res.redirect(`${process.env.FRONT_URL}?code=${authenticationCode}`);
          }
        );
      }
      apiRouter.get('/auth/token', async function (knex, req, res) {
        try {
          const { code } = req.query;
          const authorization = await knex
            .select(
              'user_id as userId',
              'due_datetime'
            )
            .from('authorizations')
            .where('code', '=', code)
            .first();
          if (authorization && (new Date()).getTime() < (authentication.due_datetime.getTime ? authentication.due_datetime.getTime() : authentication.due_datetime)) {
            await knex('authorizations')
              .where('code', '=', code)
              .delete();
            const user = await knex
              .select(
                'user_id as userId',
                'username',
                'first_name as firstName',
                'last_name as lastName',
                'email',
                'avatar',
                'role'
              )
              .from('users')
              .where('user_id', '=', authorization.userId)
              .first();
            await startSession(knex, user, res);
          }
          else {
            res
              .status(404)
              .send({
                code: 404,
                message: 'Not Found',
                description: 'Authorization code not be found'
              });
          }
        }
        catch (err) {
          res
            .status(500)
            .send({
              code: 500,
              message: 'Internal Server Error',
              description: 'Something went wrong',
              translationKey: 'somethingWentWrong'
            });
          console.error(err);
        }
      });
    }
    if (REFRESH_TOKEN_SECRET) {
      apiRouter.post('/auth/refresh-token', async function (req, res) {
        try {
          const refreshToken = req.cookies.refresh_token;
          const refreshTokenPayload = await validateRefreshToken(refreshToken);
          if (refreshTokenPayload) {
            const session = await knex
              .select('user_id as userId')
              .from('sessions')
              .where('code', '=', refreshTokenPayload.sessionCode)
              .whereNull('end_datetime')
              .first();
            if (session) {
              const user = await knex
                .select(
                  'user_id as userId',
                  'username',
                  'first_name as firstName',
                  'last_name as lastName',
                  'email',
                  'avatar',
                  'role'
                )
                .from('users')
                .where('user_id', '=', session.userId)
                .whereNull('blocked')
                .first();
              if (user) {
                const accessTokenPayload = {
                  userId: user.userId,
                  username: user.username,
                  given_name: user.given_name,
                  family_name: user.family_name,
                  email: user.email,
                  avatar: user.avatar,
                  role: user.role,
                  refreshable: true
                };
                const accessToken = Jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
                res.send(JSON.stringify({ accessToken: accessToken }));
                return;
              }
            }
          }
          res
            .status(401)
            .send({
              code: 401,
              message: 'Unauthorized',
              description: 'You do not have access to the requested resource'
            });
        }
        catch (err) {
          res
            .status(500)
            .send({
              code: 500,
              message: 'Internal Server Error',
              description: 'Something went wrong',
              translationKey: 'somethingWentWrong'
            });
          console.error(err);
        }
      });
    }
    // Set Middleware
    apiRouter.use(async function (req, res, next) {
      const accessToken = getAccessToken(req.headers);
      if (accessToken) {
        const accessTokenPayload = await validateAccessToken(accessToken);
        if (accessTokenPayload) {
          req.userId = accessTokenPayload.userId;
          req.username = accessTokenPayload.username;
          req.role = accessTokenPayload.role;
          next();
        }
        else {
          res
            .status(401)
            .send({
              code: 401,
              message: 'Unauthorized',
              description: 'You do not have access to the requested resource'
            });
        }
      }
      else {
        res
          .status(401)
          .send({
            message: 'Unauthorized',
            description: 'You do not have access to the requested resource'
          });
      }
    });
    // Additional Routes
    const filesNamesRoutes = await Fs.promises.readdir('./security/routes');
    filesNamesRoutes.forEach(fileNameRoute => {
      require('./routes/' + fileNameRoute)(knex, apiRouter, securityOptions);
    });
  }
}