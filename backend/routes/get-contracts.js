const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/contracts', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.contract_id as contractId',
          't0.code as code',
          't0.base_cost as baseCost',
          't0.additional_cost as additionalCost',
          't0.date as date',
          't1.name as customerName',
          't0.tons as tons',
          't0.deadline as deadline',
          't0.status as status',
          't0.kg_delivered as kgDelivered',
          't0.kg_target as kgTarget',
          't0.kg_dispatched as kgDispatched'
        )
        .from('contracts as t0')
        .innerJoin('customers as t1', 't1.customer_id', '=', 't0.customer_id');
      if (req.query['contractContractId'] !== null && req.query['contractContractId'] !== undefined) {
        knexQuery = knexQuery.where(knex.raw('t0.contract_id'), '=', parseInt(req.query['contractContractId']));
      }
      if (req.query['customerIds'] !== null && req.query['customerIds'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.customer_id'), req.query['customerIds'].split(',').map((value) => parseInt(value))); });
      }
      if (req.query['statuss'] !== null && req.query['statuss'] !== undefined) {
        knexQuery = knexQuery.where(function () { return this.whereIn(knex.raw('t0.status'), req.query['statuss'].split(',')); });
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
