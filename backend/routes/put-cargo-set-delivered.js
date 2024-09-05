const Security = require('../security/security.js');
const Utils = require('../utils.js');

const SetCargoAsDelivered = require('../custom/set-cargo-as-delivered.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/cargo/:cargoId/set-delivered', async function (req, res) {
    try {
      await SetCargoAsDelivered(knex, req, res);
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
