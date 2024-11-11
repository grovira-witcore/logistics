const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/transporter/:transporterId', async function (req, res) {
    try {
      let knexQuery = knex
        .select('t0.transporter_id')
        .from('transporters as t0');
      knexQuery = knexQuery.where('t0.transporter_id', '=', parseInt(req.params['transporterId']));
      const instances = await knexQuery;
      if (instances.length === 0) {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested Transporter could not be found',
            translationKey: 'theRequestedResourceCouldNotBeFound'
          });
        return;
      }
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
