const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/shipper/:shipperId', async function (req, res) {
    try {
      let data = req.body;
      const updateData = {};
      if (data.name !== undefined) {
        updateData.name = data.name;
      }
      await knex('shippers')
        .where('shipper_id', '=', parseInt(req.params['shipperId']))
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
