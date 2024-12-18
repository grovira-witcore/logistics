// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

module.exports = function (knex, apiRouter, securityOptions) {
  apiRouter.get('/auth/count-users', async function (req, res) {
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
      let knexQuery = knex
        .count('* as count')
        .from('users');
      if (req.query['username'] !== null && req.query['username'] !== undefined) {
        knexQuery = knexQuery.whereLike(knex.raw('LOWER(username)'), req.query['username'].toLowerCase());
      }
      const result = await knexQuery;
      res.send({ count: result[0].count });
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
