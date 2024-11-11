const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/customer/:customerId', async function (req, res) {
    try {
      let knexQuery = knex
        .select('t0.customer_id')
        .from('customers as t0');
      knexQuery = knexQuery.where('t0.customer_id', '=', parseInt(req.params['customerId']));
      const instances = await knexQuery;
      if (instances.length === 0) {
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
      let data = req.body;
      const updateData = {};
      if (data.name !== undefined) {
        updateData.name = data.name;
      }
      if (data.phoneNumber !== undefined) {
        updateData.phone_number = data.phoneNumber;
      }
      if (data.email !== undefined) {
        updateData.email = data.email;
      }
      await knex('customers')
        .where('customer_id', '=', parseInt(req.params['customerId']))
        .update(updateData);
      res.send(null);
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
