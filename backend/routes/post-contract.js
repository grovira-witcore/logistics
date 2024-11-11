const Utils = require('../utils.js');

const CreateContract = require('../custom/create-contract.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/contract', async function (req, res) {
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
      const result = await CreateContract(knex, ctx, data);
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
