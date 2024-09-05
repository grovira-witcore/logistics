const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/reference', async function (req, res) {
    try {
      const data = req.body;
      const [insertedReference] = await knex('references')
        .insert({
          contract_id: data.contractId,
          booking_id: data.bookingId,
          cargo_id: data.cargoId,
          url: data.url,
        })
        .returning('reference_id');
      const referenceId = typeof insertedReference === 'object' ? insertedReference.reference_id : insertedReference;
      res.send({ id: referenceId });
    }
    catch (err) {
      if (Utils.isUniqueKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Unique key constraint fails trying to insert Reference.',
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
