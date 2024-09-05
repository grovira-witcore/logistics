const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/shippers', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.shipper_id as shipperId',
          't0.name as name'
        )
        .from('shippers as t0');
      knexQuery = knexQuery.orderBy([
        { column: 't0.name', order: 'asc' },
      ]);
      if (req.query['offset']) {
        knexQuery = knexQuery.offset(parseInt(req.query['offset']));
      }
      if (req.query['limit']) {
        knexQuery = knexQuery.limit(parseInt(req.query['limit']));
      }
      const instances = await knexQuery;
      res.send(instances);
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
