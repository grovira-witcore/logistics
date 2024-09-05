const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/transporter/:transporterId', async function (req, res) {
    try {
      let data = req.body;
      const updateData = {};
      if (data.name !== undefined) {
        updateData.name = data.name;
      }
      await knex('transporters')
        .where('transporter_id', '=', parseInt(req.params['transporterId']))
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
