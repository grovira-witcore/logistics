const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/bookings', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.booking_id as bookingId',
          't0.code as code',
          't1.name as shipperName',
          't3.name as contractCustomerName',
          't2.code as contractCode',
          't0.total_cargos as totalCargos',
          't0.departure_date as departureDate',
          't0.arrival_date as arrivalDate',
          't0.status as status',
          't0.kg_delivered as kgDelivered',
          't0.kg_target as kgTarget',
          't0.kg_dispatched as kgDispatched',
          't0.cost as cost',
          't0.contract_id as contractId'
        )
        .from('bookings as t0')
        .innerJoin('shippers as t1', 't1.shipper_id', '=', 't0.shipper_id')
        .innerJoin('contracts as t2', 't2.contract_id', '=', 't0.contract_id')
        .innerJoin('customers as t3', 't3.customer_id', '=', 't2.customer_id');
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
      if (req.query['parentcontractContractId'] !== null && req.query['parentcontractContractId'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t2.contract_id'), '=', parseInt(req.query['parentcontractContractId']));
      }
      // Continue
      knexQuery = knexQuery.orderBy([
        { column: 't0.code', order: 'asc' },
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
