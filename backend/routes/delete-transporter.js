const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.delete('/transporter/:transporterId', async function (req, res) {
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
      await knex('transporters')
        .where('transporter_id', '=', parseInt(req.params['transporterId']))
        .delete();
      res.send(null);
    }
    catch (err) {
      if (Utils.isForeignKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Foreign key constraint fails trying to delete Transporter',
            translationKey: 'cannotDeleteThisObjectBecauseItHasRelations'
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
