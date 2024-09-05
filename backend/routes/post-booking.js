const Security = require('../security/security.js');
const Utils = require('../utils.js');

const CreateBooking = require('../custom/create-booking.js');

module.exports = function (knex, apiRouter) {
  apiRouter.post('/booking', async function (req, res) {
    try {
      await CreateBooking(knex, req, res);
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
