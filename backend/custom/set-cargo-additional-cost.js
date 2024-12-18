// Must receive CargoId in the path and a body with AdditionalCost, and set the
// specified additional cost in the cargo.
const RecalculateContractCosts = require('./recalculate-contract-costs.js');

module.exports = async function ({ knex, ctx, data }) {
  const { cargoId, additionalCost } = data;

  // Validate the additionalCost
  if (typeof additionalCost !== 'number' || additionalCost < 0) {
    throw new Error('Invalid additional cost.');
  }

  // Update the additional cost in the cargos table
  await knex('cargos')
    .where('cargo_id', cargoId)
    .update({
      additional_cost: additionalCost,
    });

  const cargos = await knex('cargos')
    .join('bookings', 'bookings.booking_id', 'cargos.booking_id')
    .select('bookings.contract_id as contract_id')
    .where('cargo_id', cargoId)
    .first();
    
  await RecalculateContractCosts(knex, cargos.contract_id);

  return null;
}
