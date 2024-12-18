const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-bookings', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('bookings as t0');
      if (req.query['shipperIds'] !== null && req.query['shipperIds'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.shipper_id'), req.query['shipperIds'].split(',').map((value) => parseInt(value))); });
      }
      if (req.query['contractIds'] !== null && req.query['contractIds'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.contract_id'), req.query['contractIds'].split(',').map((value) => parseInt(value))); });
      }
      if (req.query['statuss'] !== null && req.query['statuss'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.status'), req.query['statuss'].split(',')); });
      }
      if (req.query['contractContractId'] !== null && req.query['contractContractId'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.contract_id'), '=', parseInt(req.query['contractContractId']));
      }
      if (req.query['departureDateFrom'] !== null && req.query['departureDateFrom'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.departure_date'), '>=', new Date(req.query['departureDateFrom']));
      }
      if (req.query['departureDateTo'] !== null && req.query['departureDateTo'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.departure_date'), '<=', new Date(req.query['departureDateTo']));
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
