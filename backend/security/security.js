// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

const Jwt = require('jsonwebtoken');

let _rolesByUser = null;

const getUsers = async function (knex) {
  return await knex
    .select(
      'user_id as userId',
      'username as username',
      'first_name as firstName',
      'last_name as lastName',
      'email as email',
      'avatar as avatar',
      'enabled as enabled'
    )
    .from('users')
    .where('enabled', '=', true);
}
const getUsersRoles = async function (knex) {
  return await knex
    .select(
      'user_id as userId',
      'role as role'
    )
    .from('users_roles');
}

const fullSync = async function (knex) {
  const users = await getUsers(knex);
  const usersRoles = await getUsersRoles(knex);
  const rolesByUser = {};
  for (const user of users) {
    rolesByUser[user.username] = usersRoles.filter(userRole => userRole.userId === user.userId).map(userRole => userRole.role);
  }
  _rolesByUser = rolesByUser;
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

module.exports = {
  init: async function (knex, apiRouter, roles) {
    await fullSync(knex);
    apiRouter.use(function (req, res, next) {
      if (req.path === '/sessions') {
        next();
      }
      else {
        const accessToken = getAccessToken(req.headers);
        if (accessToken) {
          const payload = Jwt.verify(accessToken, 'NO-SECRET');
          if (payload) {
            req.userId = payload.userId;
            req.username = payload.preferred_username;
            req.roles = _rolesByUser[req.username];
            next();
          }
          else {
            res
              .status(401)
              .send({
                code: 401,
                message: 'Unauthorized',
                description: 'You do not have access to the requested resource.'
              });
          }
        }
        else {
          res
            .status(401)
            .send({
              message: 'Unauthorized',
              description: 'You do not have access to the requested resource.'
            });
        }
      }
    });
    apiRouter.get('/sessions', async function (req, res) {
      const users = await getUsers(knex);
      const usersRoles = await getUsersRoles(knex);
      const sessions = [];
      for (const user of users) {
        const payload = {
          userId: user.userId,
          preferred_username: user.username,
          name: user.firstName + ' ' + user.lastName
        };
        const accessToken = Jwt.sign(payload, 'NO-SECRET');
        sessions.push({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          roles: usersRoles.filter(userRole => userRole.userId === user.userId).map(userRole => userRole.role),
          accessToken: accessToken
        });
      }
      res.send(JSON.stringify(sessions));
    });
  },
  syncUser: async function (knex, username) {
    await fullSync(knex);
  }
}
