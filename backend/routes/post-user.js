const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/user', async function (req, res) {
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
      const [insertedUser] = await knex('users')
        .insert({
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          enabled: data.enabled,
        })
        .returning('user_id');
      const userId = typeof insertedUser === 'object' ? insertedUser.user_id : insertedUser;
      await Security.syncUser(knex, data.username);
      res.send({ id: userId });
    }
    catch (err) {
      if (Utils.isUniqueKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Unique key constraint fails trying to insert User.',
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
