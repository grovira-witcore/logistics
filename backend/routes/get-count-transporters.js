const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/count-transporters', async function (req, res) {
    try {
      let knexQuery = knex
        .count('* as count')
        .from('transporters as t0');
      const result = await knexQuery;
      res.send({ count: result[0].count });
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
