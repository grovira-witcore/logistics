// Given a ContractId, this operation must update its BaseCost and AdditionalCost.
// For BaseCost, it should sum all the Cost of its associated Bookings and all the
// BaseCost of the Cargo associated with these Bookings. For AdditionalCost, it
// should sum all the AdditionalCost of the Cargo associated with the Bookings
// linked to the contract.

module.exports = async function (knex, contractId) {

  // Calculate total BaseCost and AdditionalCost
  const costsBookings = await knex('bookings')
    .where('contract_id', contractId)
    .select(
      knex.raw('SUM(cost) as baseCost'),
      knex.raw('SUM(0) as additionalCost')
    )
    .first();
  const costsCargos = await knex('cargos')
    .join('bookings', 'bookings.booking_id', 'cargos.booking_id')
    .where('bookings.contract_id', contractId)
    .select(
      knex.raw('SUM(cargos.base_cost) as baseCost'),
      knex.raw('SUM(cargos.additional_cost) as additionalCost')
    )
    .first();

  const baseCost = (costsBookings.baseCost ?? 0) + (costsCargos.baseCost ?? 0);
  const additionalCost = (costsBookings.additionalCost ?? 0) + (costsCargos.additionalCost ?? 0);

  // Update the contract with the new costs
  await knex('contracts')
    .where('contract_id', contractId)
    .update({
      base_cost: baseCost,
      additional_cost: additionalCost
    });

}
