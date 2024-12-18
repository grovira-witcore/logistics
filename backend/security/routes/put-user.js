// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.put('/auth/user/:userId', async function (req, res) {
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
      if (userId === 1) {
        throw new Error('Cannot update the seed user.');
      }
      if (!securityOptions.roles.includes(data.role)) {
        throw new Error('Invalid role: "' + data.role + '"');
      }
      const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.role
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
