const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-users', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('users as t0');
      if (req.query['username'] !== null && req.query['username'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereLike(knex.raw('LOWER(t0.username)'), req.query['username'].toLowerCase()); });
      }
      if (req.query['enabled'] !== null && req.query['enabled'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.enabled'), '=', (req.query['enabled'] ? 1 : 0));
      }
      if (true) {
        // No Security Filter
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
