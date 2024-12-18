// Must receive in the body of the request an object with { Code, BookingId,
// Pallets, GrossLb, TransporterId } and must create a Cargo in the database setting
// those values plus TareLb = Pallets * 50, TareKg = Round(TareLb * 0.453592),
// GrossKg = Round(GrossLb * 0.453592), NetLb = GrossLb - TareLb, NetKg = GrossKg -
// TareKg, Status = inPreparation (Enum CargoStatus).
const RecalculateContractCosts = require('./recalculate-contract-costs.js');

module.exports = async function ({ knex, ctx, data }) {
  const { code, bookingId, pallets, grossLb, transporterId, baseCost } = data;

  // Calculate the tare weight in pounds and kilograms
  const tareLb = pallets * 50;
  const tareKg = Math.round(tareLb * 0.453592);

  // Calculate the gross weight in kilograms
  const grossKg = Math.round(grossLb * 0.453592);

  // Calculate the net weight in pounds and kilograms
  const netLb = grossLb - tareLb;
  const netKg = grossKg - tareKg;

  // Insert the new cargo into the database
  const [cargoId] = await knex('cargos').insert({
    code: code,
    booking_id: bookingId,
    pallets: pallets,
    tare_lb: tareLb,
    tare_kg: tareKg,
    gross_lb: grossLb,
    gross_kg: grossKg,
    net_lb: netLb,
    net_kg: netKg,
    transporter_id: transporterId,
    status: 'inPreparation',
    base_cost: baseCost
  }).returning('cargo_id');

  await knex('bookings')
    .where('booking_id', bookingId)
    .increment('available_cargos', -1);

  const booking = await knex('bookings')
    .select('contract_id', 'available_cargos')
    .where('booking_id', bookingId)
    .first();

  const totalNetKg = await knex('cargos')
    .sum('net_kg as total')
    .where('booking_id', bookingId)
    .first();

  const kgTarget = booking.available_cargos * 20000 + totalNetKg.total;

  await knex('bookings')
    .where('booking_id', bookingId)
    .update({
      kg_target: kgTarget
    });

  await RecalculateContractCosts(knex, booking.contract_id);

  // Respond with the newly created cargo ID
  return { cargoId };
}
