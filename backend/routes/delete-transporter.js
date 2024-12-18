const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.delete('/transporter/:transporterId', async function (req, res) {
    try {
      let knexQuery = knex
        .select('t0.transporter_id')
        .from('transporters as t0');
      // Continue
      // Continue
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
      const ctx = {
        userId: req.userId,
        username: req.username,
        role: req.role
      };
      const id = parseInt(req.params['transporterId']);
      await knex.transaction(async trx => {
        await Managers.transporter.delete(trx, ctx, id);
        await Managers.auditLog.insert(
          trx,
          ctx,
          {
            entityName: 'transporter',
            entityId: id,
            actionName: 'delete',
          }
        );
        await trx.commit();
      });
      res.send(null);
    }
    catch (err) {
      if (err.translationKey) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: err.message,
            translationKey: err.translationKey
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
