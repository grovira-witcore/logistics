const Utils = require('../utils.js');

const CreateCargo = require('../custom/create-cargo.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/cargo', async function (req, res) {
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
      const result = await CreateCargo(knex, ctx, data);
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
