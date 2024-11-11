const Utils = require('../utils.js');

const SetCargoAdditionalCost = require('../custom/set-cargo-additional-cost.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/cargo/:cargoId/additional-cost', async function (req, res) {
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
      const result = await SetCargoAdditionalCost(knex, ctx, data);
      res.status(200).send(result ?? {});
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
