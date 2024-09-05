const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/user-roles', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.user_role_id as userRoleId',
          't0.role as role'
        )
        .from('users_roles as t0');
      if (req.query['userUserId'] !== null && req.query['userUserId'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.user_id'), '=', parseInt(req.query['userUserId']));
      }
      if (true) {
        // No Security Filter
      }
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
