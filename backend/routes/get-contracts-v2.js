const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/contracts/v2', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.contract_id as contractId',
          't0.code as code',
          't0.date as date',
          't1.name as customerName',
          't0.tons as tons',
          't0.deadline as deadline',
          't0.kg_delivered as kgDelivered',
          't0.kg_target as kgTarget',
          't0.kg_dispatched as kgDispatched',
          't0.base_cost as baseCost',
          't0.additional_cost as additionalCost'
        )
        .from('contracts as t0')
        .innerJoin('customers as t1', 't1.customer_id', '=', 't0.customer_id');
      knexQuery = knexQuery.where(knex.raw('t0.status'), '=', 'inProgress');
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
