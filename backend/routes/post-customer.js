const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/customer', async function (req, res) {
    try {
      if (true) {
        // Nothing to do
      }
      const ctx = {
        userId: req.userId,
        username: req.username,
        role: req.role
      };
      let id = null;
      await knex.transaction(async trx => {
        id = await Managers.customer.insert(trx, ctx, req.body);
        await Managers.auditLog.insert(
          trx,
          ctx,
          {
            entityName: 'customer',
            entityId: id,
            actionName: 'create',
            data: Utils.getAuditLogData(req.body)
          }
        );
        await trx.commit();
      });
      res.send({ id: id });
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
