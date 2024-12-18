const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/cargos/v2', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.cargo_id as cargoId',
          't0.dispatched_date as dispatchedDate',
          't1.name as transporterName',
          't4.name as bookingContractCustomerName',
          't3.code as bookingContractCode',
          't2.code as bookingCode',
          't0.base_cost as baseCost',
          't0.additional_cost as additionalCost'
        )
        .from('cargos as t0')
        .innerJoin('transporters as t1', 't1.transporter_id', '=', 't0.transporter_id')
        .innerJoin('bookings as t2', 't2.booking_id', '=', 't0.booking_id')
        .innerJoin('contracts as t3', 't3.contract_id', '=', 't2.contract_id')
        .innerJoin('customers as t4', 't4.customer_id', '=', 't3.customer_id');
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
      knexQuery = knexQuery.orderBy([
        { column: 't0.dispatched_date', order: 'desc' },
      ]);
      if (req.query['offset']) {
        knexQuery = knexQuery.offset(parseInt(req.query['offset']));
      }
      if (req.query['limit']) {
        knexQuery = knexQuery.limit(parseInt(req.query['limit']));
      }
      const instances = await knexQuery;
      res.send(instances.map(instance => ({
        ...instance,
        access_write: (function () {
          if (true) {
            return true;
          }
          return true;
        })(),
        access_delete: (function () {
          if (true) {
            return true;
          }
          return true;
        })(),
      })));
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
