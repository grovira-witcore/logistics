const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-cargos', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('cargos as t0')
        .innerJoin('bookings as t1', 't1.booking_id', '=', 't0.booking_id')
        .innerJoin('contracts as t2', 't2.contract_id', '=', 't1.contract_id');
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
        knexQuery = knexQuery.where(knex.raw('t2.contract_id'), '=', parseInt(req.query['parentparentcontractContractId']));
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
