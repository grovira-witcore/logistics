const Security = require('../security/security.js');
const Utils = require('../utils.js');

const SetCargoAsDispatched = require('../custom/set-cargo-as-dispatched.js');

module.exports = function (knex, apiRouter) {
  apiRouter.put('/cargo/:cargoId/set-dispatched', async function (req, res) {
    try {
      await SetCargoAsDispatched(knex, req, res);
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
