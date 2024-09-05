const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/user-role/:userRoleId', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.user_role_id as userRoleId',
          't0.role as role'
        )
        .from('users_roles as t0');
      if (true) {
        // No Security Filter
      }
      knexQuery = knexQuery.where('t0.user_role_id', '=', parseInt(req.params['userRoleId']));
      const instances = await knexQuery;
      if (instances.length > 0) {
        const instance = instances[0];
        res.send({
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
        });
      }
      else {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested UserRole could not be found.',
            translationKey: 'theRequestedResourceCouldNotBeFound'
          });
        return;
      }
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
