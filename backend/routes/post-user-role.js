const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/user-role', async function (req, res) {
    try {
      if (req.roles.includes('administrator')) {
        // Nothing to do
      }
      else {
        res
          .status(403)
          .send({
            code: 403,
            message: 'Forbidden',
            description: 'Access denied.',
            translationKey: 'accessDenied'
          });
        return;
      }
      const data = req.body;
      const [insertedUserRole] = await knex('users_roles')
        .insert({
          user_id: data.userId,
          role: data.role,
        })
        .returning('user_role_id');
      const userRoleId = typeof insertedUserRole === 'object' ? insertedUserRole.user_role_id : insertedUserRole;
      const user = (await knex.select('username').from('users').where('user_id', '=', data.userId))[0];
      await Security.syncUser(knex, user.username);
      res.send({ id: userRoleId });
    }
    catch (err) {
      if (Utils.isUniqueKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Unique key constraint fails trying to insert UserRole.',
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
