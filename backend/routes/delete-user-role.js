const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.delete('/user-role/:userRoleId', async function (req, res) {
    try {
      let knexQuery = knex
        .select('t0.user_role_id')
        .from('users_roles as t0');
      if (true) {
        // No Security Filter
      }
      if (req.roles.includes('administrator')) {
        // No Security Filter
      }
      else {
        knexQuery = knexQuery.where(knex.raw('1 = 0'));
      }
      knexQuery = knexQuery.where('t0.user_role_id', '=', parseInt(req.params['userRoleId']));
      const instances = await knexQuery;
      if (instances.length === 0) {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested UserRole could not be found.',
            translationKey: 'theRequestedResourceCouldNotBeFound'
          });
        return;
        return;
      }
      const userRole = (await knex.select('user_id as userId').from('users_roles').where('user_role_id', '=', parseInt(req.params['userRoleId'])))[0];
      const user = (await knex.select('username').from('users').where('user_id', '=', userRole.userId))[0];
      if (req.username === user.username) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'You cannot delete roles to your own user account.',
            translationKey: 'youCannotDeleteRolesToYourOwnUserAccount'
          });
        return;
      }
      await knex('users_roles')
        .where('user_role_id', '=', parseInt(req.params['userRoleId']))
        .delete();
      await Security.syncUser(knex, user.username);
      res.send(null);
    }
    catch (err) {
      if (Utils.isForeignKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Foreign key constraint fails trying to delete UserRole.',
            translationKey: 'cannotDeleteThisObjectBecauseItHasRelations'
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
