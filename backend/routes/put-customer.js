const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/customer/:customerId', async function (req, res) {
    try {
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
