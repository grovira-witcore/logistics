const Utils = require('../utils.js');
const Managers = require('../managers/index.js');

module.exports = function (knex, apiRouter) {
  apiRouter.get('/omni-search/:value', async function (req, res) {
    const groups = await Promise.all([
      (async function () {
        try {
          let joinAccesses = false;
          let knexQuery = knex
            .select(
              't0.contract_id as contractId',
              't0.code as code'
            )
            .from('contracts as t0');
          knexQuery = knexQuery.where(function () { return this.where(function () { return this.whereLike(knex.raw('LOWER(t0.code)'), knex.raw('?', (req.params['value'] + '%').toLowerCase()))}); });
          // Continue
          knexQuery = knexQuery.limit(6);
          const instances = await knexQuery;
          return instances;
        }
        catch (err) {
          console.error(err);
          return [];
        }
      })(),
      (async function () {
        try {
          let joinAccesses = false;
          let knexQuery = knex
            .select(
              't0.booking_id as bookingId',
              't0.code as code'
            )
            .from('bookings as t0');
          knexQuery = knexQuery.where(function () { return this.where(function () { return this.whereLike(knex.raw('LOWER(t0.code)'), knex.raw('?', (req.params['value'] + '%').toLowerCase()))}); });
          // Continue
          knexQuery = knexQuery.limit(6);
          const instances = await knexQuery;
          return instances;
        }
        catch (err) {
          console.error(err);
          return [];
        }
      })(),
      (async function () {
        try {
          let joinAccesses = false;
          let knexQuery = knex
            .select(
              't0.cargo_id as cargoId',
              't0.code as code',
              't0.container_code as containerCode',
              't0.container_seal as containerSeal'
            )
            .from('cargos as t0');
          knexQuery = knexQuery.where(function () { return this.where(function () { return this.whereLike(knex.raw('LOWER(t0.code)'), knex.raw('?', (req.params['value'] + '%').toLowerCase()))}).orWhere(function () { return this.whereLike(knex.raw('LOWER(t0.container_code)'), knex.raw('?', (req.params['value'] + '%').toLowerCase()))}).orWhere(function () { return this.whereLike(knex.raw('LOWER(t0.container_seal)'), knex.raw('?', (req.params['value'] + '%').toLowerCase()))}); });
          // Continue
          knexQuery = knexQuery.limit(6);
          const instances = await knexQuery;
          return instances;
        }
        catch (err) {
          console.error(err);
          return [];
        }
      })(),
    ]);
    res.send(groups);
  });
}
