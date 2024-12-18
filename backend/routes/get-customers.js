const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/customers', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.customer_id as customerId',
          't0.name as name',
          't0.phone_number as phoneNumber',
          't0.email as email'
        )
        .from('customers as t0');
      // Continue
      knexQuery = knexQuery.orderBy([
        { column: 't0.name', order: 'asc' },
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