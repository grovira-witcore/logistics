const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/cargos', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.cargo_id as cargoId',
          't0.code as code',
          't1.name as transporterName',
          't0.pallets as pallets',
          't0.gross_lb as grossLb',
          't0.gross_kg as grossKg',
          't0.net_lb as netLb',
          't0.net_kg as netKg',
          't0.status as status',
          't0.container_code as containerCode',
          't0.container_seal as containerSeal',
          't4.name as bookingContractCustomerName',
          't3.code as bookingContractCode',
          't2.code as bookingCode',
          't0.base_cost as baseCost',
          't0.additional_cost as additionalCost',
          't0.booking_id as bookingId'
        )
        .from('cargos as t0')
        .innerJoin('transporters as t1', 't1.transporter_id', '=', 't0.transporter_id')
        .innerJoin('bookings as t2', 't2.booking_id', '=', 't0.booking_id')
        .innerJoin('contracts as t3', 't3.contract_id', '=', 't2.contract_id')
        .innerJoin('customers as t4', 't4.customer_id', '=', 't3.customer_id');
      if (req.query['bookingBookingId'] !== null && req.query['bookingBookingId'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.booking_id'), '=', parseInt(req.query['bookingBookingId']));
      }
      if (req.query['transporterIds'] !== null && req.query['transporterIds'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.transporter_id'), req.query['transporterIds'].split(',').map((value) => parseInt(value))); });
      }
      if (req.query['bookingIds'] !== null && req.query['bookingIds'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.booking_id'), req.query['bookingIds'].split(',').map((value) => parseInt(value))); });
      }
      if (req.query['statuss'] !== null && req.query['statuss'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.status'), req.query['statuss'].split(',')); });
      }
      if (req.query['parentparentcontractContractId'] !== null && req.query['parentparentcontractContractId'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t3.contract_id'), '=', parseInt(req.query['parentparentcontractContractId']));
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
