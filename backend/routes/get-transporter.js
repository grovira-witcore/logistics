const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/transporter/:transporterId', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.transporter_id as transporterId',
          't0.name as name'
        )
        .from('transporters as t0');
      knexQuery = knexQuery.where('t0.transporter_id', '=', parseInt(req.params['transporterId']));
      const instances = await knexQuery;
      if (instances.length > 0) {
        const instance = instances[0];
        res.send(instance);
      }
      else {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested Transporter could not be found.',
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
