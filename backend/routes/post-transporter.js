const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/transporter', async function (req, res) {
    try {
      if (true) {
        // Nothing to do
      }
      const data = req.body;
      const [insertedTransporter] = await knex('transporters')
        .insert({
          name: data.name,
        })
        .returning('transporter_id');
      const transporterId = typeof insertedTransporter === 'object' ? insertedTransporter.transporter_id : insertedTransporter;
      res.send({ id: transporterId });
    }
    catch (err) {
      if (Utils.isUniqueKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Unique key constraint fails trying to insert Transporter',
            translationKey: 'cannotCreateThisObjectBecauseItAlreadyExists'
          });
        return;
      }
      else {
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
    }
  });
}
