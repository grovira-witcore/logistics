const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-contracts/v2', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('contracts as t0');
      knexQuery = knexQuery.where(knex.raw('t0.status'), '=', 'inProgress');
      // Continue
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
