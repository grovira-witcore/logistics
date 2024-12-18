const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

const CreateBooking = require('../custom/create-booking.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/booking', async function (req, res) {
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
        ...req.body
      };
      const saveAuditLog = async function (trx, newId) {
        await Managers.auditLog.insert(
          trx,
          ctx,
          {
            entityName: 'booking',
            entityId: newId,
            actionName: 'create',
            data: Utils.getAuditLogData(
              req.body,
              [
                { sourceKey: 'contractId', targetKey: 'contract', entityName: 'contract' },
                { sourceKey: 'shipperId', targetKey: 'shipper', entityName: 'shipper' },
              ]
            )
          }
        );
      }
      const result = await CreateBooking({ knex, ctx, data, managers: Managers, saveAuditLog });
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
