const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-contracts', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('contracts as t0');
      if (req.query['customerIds'] !== null && req.query['customerIds'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.customer_id'), req.query['customerIds'].split(',').map((value) => parseInt(value))); });
      }
      if (req.query['statuss'] !== null && req.query['statuss'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.status'), req.query['statuss'].split(',')); });
      }
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
