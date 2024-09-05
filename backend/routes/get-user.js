const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/user/:userId', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.user_id as userId',
          't0.email as email',
          't0.enabled as enabled',
          't0.first_name as firstName',
          't0.last_name as lastName',
          't0.avatar as avatar',
          't0.username as username'
        )
        .from('users as t0');
      if (true) {
        // No Security Filter
      }
      knexQuery = knexQuery.where('t0.user_id', '=', parseInt(req.params['userId']));
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
            description: 'The requested User could not be found.',
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
