const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/reference', async function (req, res) {
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
        id = await Managers.reference.insert(trx, ctx, req.body);
        await Managers.auditLog.insert(
          trx,
          ctx,
          {
            entityName: 'reference',
            entityId: id,
            actionName: 'create',
            data: Utils.getAuditLogData(
              req.body,
              [
                { sourceKey: 'contractId', targetKey: 'contract', entityName: 'contract' },
                { sourceKey: 'bookingId', targetKey: 'booking', entityName: 'booking' },
                { sourceKey: 'cargoId', targetKey: 'cargo', entityName: 'cargo' },
              ]
            )
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
