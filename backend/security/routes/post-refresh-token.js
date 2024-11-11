const Jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '1w';

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

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.post('/auth/refresh-token', async function (req, res) {
    try {
      const accessToken = getAccessToken(req.headers);
      const accessTokenPayload = await validateAccessToken(accessToken);
      const refreshToken = req.body.refreshToken;
      const refreshTokenPayload = await validateRefreshToken(refreshToken);
      if (accessTokenPayload && refreshTokenPayload) {
        const sessions = await knex
          .select('session_id')
          .from('sessions')
          .where('code', '=', refreshTokenPayload.session_code)
          .andWhere('access_token', '=', accessToken)
          .andWhere('refresh_token', '=', refreshToken);
        if (sessions && sessions.length > 0) {
          const session = sessions[0];
          const newAccessTokenPayload = {
            userId: accessTokenPayload.userId,
            username: accessTokenPayload.username,
            given_name: accessTokenPayload.given_name,
            family_name: accessTokenPayload.family_name,
            email: accessTokenPayload.email,
            avatar: accessTokenPayload.avatar,
            role: accessTokenPayload.role
          };
          const newAccessToken = Jwt.sign(newAccessTokenPayload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
          await knex('sessions')
            .where('session_id', '=', session.session_id)
            .update({
              access_token: newAccessToken,
              last_refreshed_datetime: new Date()
            });
          res.send(JSON.stringify({ accessToken: newAccessToken }));
          return;
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