// Must receive CargoId in the path and a body with AdditionalCost, and set the
// specified additional cost in the cargo.
const RecalculateContractCosts = require('./recalculate-contract-costs.js');

module.exports = async function (knex, req, res) {
  const cargoId = parseInt(req.params.cargoId);
  const { additionalCost } = req.body;

  // Validate the additionalCost
  if (typeof additionalCost !== 'number' || additionalCost < 0) {
    return res.status(400).send({ error: 'Invalid additional cost.' });
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

  res.status(200).send({ message: 'Additional cost updated successfully.' });
}
