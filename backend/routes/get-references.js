const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/references', async function (req, res) {
    try {
      let knexQuery = knex
        .select(
          't0.reference_id as referenceId',
          't0.url as url'
        )
        .from('references as t0')
        .innerJoin('contracts as t1', 't1.contract_id', '=', 't0.contract_id');
      knexQuery = knexQuery.orderBy([
        { column: 't1.code', order: 'asc' },
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
