// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

const Bcrypt = require('bcrypt');
const Utils = require('../../utils.js');

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.post('/auth/user', async function (req, res) {
    try {
      if (req.role !== 'administrator') {
        res
          .status(403)
          .send({
            code: 403,
            message: 'Forbidden',
            description: 'Access denied',
            translationKey: 'accessDenied'
          });
        return;
      }
      const data = req.body;
      if (!securityOptions.roles.includes(data.role)) {
        throw new Error('Invalid role: "' + data.role + '"');
      }
      const userData = {
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.role
      }
      if (data.providerName) {
        if (securityOptions.enableProvidersNames === null || securityOptions.enableProvidersNames === undefined || !securityOptions.enableProvidersNames.includes(data.providerName)) {
          throw new Error('Invalid provder: "' + data.providerName + '"');
        }
        userData.provider_name = data.providerName;
      }
      else if (data.temporaryPassword) {
        if (!securityOptions.enableByUserPassword) {
          throw new Error('Inconsistent request');
        }
        userData.hashed_password = await Bcrypt.hash(data.temporaryPassword, 10);
        userData.must_change_password = true;
      }
      else {
        throw new Error('Inconsistent request');
      }
      const [insertedUser] = await knex('users')
        .insert(userData)
        .returning('user_id');
      const userId = typeof insertedUser === 'object' ? insertedUser.user_id : insertedUser;
      res.send({ id: userId });
    }
    catch (err) {
      if (Utils.isUniqueKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Unique key constraint fails trying to insert Activity',
            translationKey: 'cannotCreateThisObjectBecauseItAlreadyExists'
          });
        return;
      }
      else {
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
    }
  });
}
