const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/shipper', async function (req, res) {
    try {
      const data = req.body;
      const [insertedShipper] = await knex('shippers')
        .insert({
          name: data.name,
        })
        .returning('shipper_id');
      const shipperId = typeof insertedShipper === 'object' ? insertedShipper.shipper_id : insertedShipper;
      res.send({ id: shipperId });
    }
    catch (err) {
      if (Utils.isUniqueKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Unique key constraint fails trying to insert Shipper.',
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
