const Security = require('../security/security.js');
const Utils = require('../utils.js');

const CreateContract = require('../custom/create-contract.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/contract', async function (req, res) {
    try {
      await CreateContract(knex, req, res);
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
