const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/customer/:customerId', async function (req, res) {
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
      knexQuery = knexQuery.where('t0.customer_id', '=', parseInt(req.params['customerId']));
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
            description: 'The requested Customer could not be found',
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
