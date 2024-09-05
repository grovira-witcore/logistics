const Security = require('../security/security.js');
const Utils = require('../utils.js');

module.exports = function (knex, apiRouter) {
  apiRouter.delete('/shipper/:shipperId', async function (req, res) {
    try {
      await knex('shippers')
        .where('shipper_id', '=', parseInt(req.params['shipperId']))
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
            description: 'Foreign key constraint fails trying to delete Shipper.',
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
