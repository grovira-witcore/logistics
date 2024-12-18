const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/contract/:contractId', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.contract_id as contractId',
          't0.date as date',
          't1.name as customerName',
          't0.tons as tons',
          't0.deadline as deadline',
          't0.status as status',
          't0.kg_delivered as kgDelivered',
          't0.kg_target as kgTarget',
          't0.kg_dispatched as kgDispatched',
          't0.code as code',
          't0.base_cost as baseCost',
          't0.additional_cost as additionalCost'
        )
        .from('contracts as t0')
        .innerJoin('customers as t1', 't1.customer_id', '=', 't0.customer_id');
      // Continue
      knexQuery = knexQuery.where('t0.contract_id', '=', parseInt(req.params['contractId']));
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
            description: 'The requested Contract could not be found',
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
