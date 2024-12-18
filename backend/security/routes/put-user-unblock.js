// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.put('/auth/user/:userId/unblock', async function (req, res) {
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
      await knex('users')
        .where('user_id', '=', userId)
        .update({ blocked: null });
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
