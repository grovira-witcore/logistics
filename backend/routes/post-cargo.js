const Security = require('../security/security.js');
const Utils = require('../utils.js');

const CreateCargo = require('../custom/create-cargo.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/cargo', async function (req, res) {
    try {
      await CreateCargo(knex, req, res);
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
