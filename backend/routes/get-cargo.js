const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/cargo/:cargoId', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.cargo_id as cargoId',
          't3.name as bookingContractCustomerName',
          't2.code as bookingContractCode',
          't1.contract_id as bookingContractId',
          't1.code as bookingCode',
          't0.booking_id as bookingId',
          't4.name as transporterName',
          't0.pallets as pallets',
          't0.code as code',
          't0.status as status',
          't0.additional_cost as additionalCost',
          't0.tare_lb as tareLb',
          't0.tare_kg as tareKg',
          't0.gross_lb as grossLb',
          't0.gross_kg as grossKg',
          't0.net_lb as netLb',
          't0.net_kg as netKg',
          't0.dispatched_date as dispatchedDate',
          't0.delivered_date as deliveredDate',
          't0.container_code as containerCode',
          't0.container_seal as containerSeal',
          't0.base_cost as baseCost'
        )
        .from('cargos as t0')
        .innerJoin('bookings as t1', 't1.booking_id', '=', 't0.booking_id')
        .innerJoin('contracts as t2', 't2.contract_id', '=', 't1.contract_id')
        .innerJoin('customers as t3', 't3.customer_id', '=', 't2.customer_id')
        .innerJoin('transporters as t4', 't4.transporter_id', '=', 't0.transporter_id');
      // Continue
      knexQuery = knexQuery.where('t0.cargo_id', '=', parseInt(req.params['cargoId']));
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
            description: 'The requested Cargo could not be found',
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
