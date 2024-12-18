const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-cargos/v2', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('cargos as t0');
      knexQuery = knexQuery.where(function () { return this.whereNotNull(knex.raw('t0.dispatched_date')); });
      if (req.query['dispatchedDateFrom'] !== null && req.query['dispatchedDateFrom'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.dispatched_date'), '>=', new Date(req.query['dispatchedDateFrom']));
      }
      if (req.query['dispatchedDateTo'] !== null && req.query['dispatchedDateTo'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.dispatched_date'), '<=', new Date(req.query['dispatchedDateTo']));
      }
      if (req.query['transporterIds'] !== null && req.query['transporterIds'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.transporter_id'), req.query['transporterIds'].split(',').map((value) => parseInt(value))); });
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
