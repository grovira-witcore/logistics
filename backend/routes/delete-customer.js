const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.delete('/customer/:customerId', async function (req, res) {
    try {
      let knexQuery = knex
        .select('t0.customer_id')
        .from('customers as t0');
      // Continue
      // Continue
      knexQuery = knexQuery.where('t0.customer_id', '=', parseInt(req.params['customerId']));
      const instances = await knexQuery;
      if (instances.length === 0) {
        res
          .status(404)
          .send({
            code: 404,
            message: 'Not Found',
            description: 'The requested Customer could not be found',
            translationKey: 'theRequestedResourceCouldNotBeFound'
          });
        return;
      }
      const ctx = {
        userId: req.userId,
        username: req.username,
        role: req.role
      };
      const id = parseInt(req.params['customerId']);
      await knex.transaction(async trx => {
        await Managers.customer.delete(trx, ctx, id);
        await Managers.auditLog.insert(
          trx,
          ctx,
          {
            entityName: 'customer',
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
