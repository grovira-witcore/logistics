const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/customer', async function (req, res) {
    try {
      const data = req.body;
      const [insertedCustomer] = await knex('customers')
        .insert({
          name: data.name,
          phone_number: data.phoneNumber,
          email: data.email,
        })
        .returning('customer_id');
      const customerId = typeof insertedCustomer === 'object' ? insertedCustomer.customer_id : insertedCustomer;
      res.send({ id: customerId });
    }
    catch (err) {
      if (Utils.isUniqueKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Unique key constraint fails trying to insert Customer.',
            translationKey: 'cannotCreateThisObjectBecauseItAlreadyExists'
          });
        return;
      }
      else {
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
    }
  });
}
