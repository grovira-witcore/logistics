// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

const Bcrypt = require('bcrypt');

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.put('/auth/user/:userId/reset-password', async function (req, res) {
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
      const { userId } = req.params;
      const data = req.body;
      const userData = {
        hashed_password: await Bcrypt.hash(data.temporaryPassword, 10),
        must_change_password: true
      }
      await knex('users')
        .where('user_id', '=', userId)
        .update(userData);
      res.send({});
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
