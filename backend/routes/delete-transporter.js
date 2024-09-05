const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.delete('/transporter/:transporterId', async function (req, res) {
    try {
      await knex('transporters')
        .where('transporter_id', '=', parseInt(req.params['transporterId']))
        .delete();
      res.send(null);
    }
    catch (err) {
      if (Utils.isForeignKeyError(err)) {
        res
          .status(409)
          .send({
            code: 409,
            message: 'Conflict',
            description: 'Foreign key constraint fails trying to delete Transporter.',
            translationKey: 'cannotDeleteThisObjectBecauseItHasRelations'
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
