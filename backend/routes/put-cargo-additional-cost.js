const Security = require('../security/security.js');
const Utils = require('../utils.js');

const SetCargoAdditionalCost = require('../custom/set-cargo-additional-cost.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/cargo/:cargoId/additional-cost', async function (req, res) {
    try {
      await SetCargoAdditionalCost(knex, req, res);
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
