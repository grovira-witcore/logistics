const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/shipper/:shipperId', async function (req, res) {
    try {
      let knexQuery = knex
        .select('t0.shipper_id')
        .from('shippers as t0');
      knexQuery = knexQuery.where('t0.shipper_id', '=', parseInt(req.params['shipperId']));
      const instances = await knexQuery;
      if (instances.length === 0) {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested Shipper could not be found',
            translationKey: 'theRequestedResourceCouldNotBeFound'
          });
        return;
      }
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
