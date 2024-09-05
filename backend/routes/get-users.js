const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/users', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.user_id as userId',
          't0.first_name as firstName',
          't0.last_name as lastName',
          't0.avatar as avatar',
          't0.username as username',
          't0.email as email',
          't0.enabled as enabled'
        )
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
      knexQuery = knexQuery.orderBy([
        { column: 't0.username', order: 'asc' },
      ]);
      if (req.query['offset']) {
        knexQuery = knexQuery.offset(parseInt(req.query['offset']));
      }
      if (req.query['limit']) {
        knexQuery = knexQuery.limit(parseInt(req.query['limit']));
      }
      const instances = (await knexQuery).map(instance => ({
        ...instance,
        access_write: (function () {
          if (req.roles.includes('administrator')) {
            return true;
          }
          else {
            return false;
          }
          return true;
        })(),
        access_delete: (function () {
          if (req.roles.includes('administrator')) {
            return true;
          }
          else {
            return false;
          }
          return true;
        })(),
      }));
      res.send(instances);
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
