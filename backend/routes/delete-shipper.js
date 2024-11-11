const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.delete('/shipper/:shipperId', async function (req, res) {
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
      await knex('shippers')
        .where('shipper_id', '=', parseInt(req.params['shipperId']))
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
            description: 'Foreign key constraint fails trying to delete Shipper',
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
