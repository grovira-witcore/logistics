const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-user-roles', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('users_roles as t0');
      if (req.query['userUserId'] !== null && req.query['userUserId'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.user_id'), '=', parseInt(req.query['userUserId']));
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
