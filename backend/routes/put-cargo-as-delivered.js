const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

const SetCargoAsDelivered = require('../custom/set-cargo-as-delivered.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/cargo/:cargoId/as-delivered', async function (req, res) {
    try {
      if (true) {
        // Nothing to do
      }
      const ctx = {
        userId: req.userId,
        username: req.username,
        role: req.role
      };
      const data = {
        cargoId: parseInt(req.params.cargoId),
        ...req.body
      };
      const saveAuditLog = async function (trx) {
        await Managers.auditLog.insert(
          trx,
          ctx,
          {
            entityName: 'cargo',
            entityId: data.cargoId,
            actionName: 'setAsDelivered',
            data: Utils.getAuditLogData(
              req.body,
              [
                { sourceKey: 'cargoId', targetKey: 'cargo', entityName: 'cargo' },
              ]
            )
          }
        );
      }
      const result = await SetCargoAsDelivered({ knex, ctx, data, managers: Managers, saveAuditLog });
      res.status(200).send(result ?? {});
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
