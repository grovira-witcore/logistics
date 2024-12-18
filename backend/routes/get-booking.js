const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/booking/:bookingId', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.booking_id as bookingId',
          't2.name as contractCustomerName',
          't1.code as contractCode',
          't0.contract_id as contractId',
          't3.name as shipperName',
          't0.total_cargos as totalCargos',
          't0.status as status',
          't0.kg_delivered as kgDelivered',
          't0.kg_target as kgTarget',
          't0.kg_dispatched as kgDispatched',
          't0.code as code',
          't0.available_cargos as availableCargos',
          't0.departure_date as departureDate',
          't0.arrival_date as arrivalDate',
          't0.cost as cost'
        )
        .from('bookings as t0')
        .innerJoin('contracts as t1', 't1.contract_id', '=', 't0.contract_id')
        .innerJoin('customers as t2', 't2.customer_id', '=', 't1.customer_id')
        .innerJoin('shippers as t3', 't3.shipper_id', '=', 't0.shipper_id');
      // Continue
      knexQuery = knexQuery.where('t0.booking_id', '=', parseInt(req.params['bookingId']));
      const instances = await knexQuery;
      if (instances.length > 0) {
        const instance = instances[0];
        res.send({
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
        });
      }
      else {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested Booking could not be found',
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
