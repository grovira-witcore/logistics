const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/user/:userId', async function (req, res) {
    try {
      let knexQuery = knex
        .select('t0.user_id')
        .from('users as t0');
      if (true) {
        // No Security Filter
      }
      if (req.roles.includes('administrator')) {
        // No Security Filter
      }
      else {
        knexQuery = knexQuery.where(knex.raw('1 = 0'));
      }
      knexQuery = knexQuery.where('t0.user_id', '=', parseInt(req.params['userId']));
      const instances = await knexQuery;
      if (instances.length === 0) {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested User could not be found.',
            translationKey: 'theRequestedResourceCouldNotBeFound'
          });
        return;
        return;
      }
      let data = req.body;
      const updateData = {};
      if (data.username !== undefined) {
        updateData.username = data.username;
      }
      if (data.firstName !== undefined) {
        updateData.first_name = data.firstName;
      }
      if (data.lastName !== undefined) {
        updateData.last_name = data.lastName;
      }
      if (data.email !== undefined) {
        updateData.email = data.email;
      }
      if (data.enabled !== undefined) {
        updateData.enabled = data.enabled;
      }
      await knex('users')
        .where('user_id', '=', parseInt(req.params['userId']))
        .update(updateData);
      const user = (await knex.select('username').from('users').where('user_id', '=', parseInt(req.params['userId'])))[0];
      await Security.syncUser(knex, user.username);
      res.send(null);
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
