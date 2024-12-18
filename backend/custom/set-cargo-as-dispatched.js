// Given a CargoId received in the path, receive a body with { DispatchedDate } and
// (1) update the Cargo setting Status = 'dispatched' and DispatchedDate = the one
// received in the body, (2) read NetKg and obtain the associated BookingId and the
// associated ContractId from the associated Booking, (4) update the Booking and the
// Contract by adding the NetKg to the KgDispatched in each of those tables.

module.exports = async function ({ knex, ctx, data }) {
  const { cargoId, dispatchedDate } = data;

  // Start a transaction
  await knex.transaction(async trx => {
    // (1) Update the Cargo setting Status = 'dispatched' and DispatchedDate
    await trx('cargos')
      .where('cargo_id', cargoId)
      .update({
        status: 'dispatched',
        dispatched_date: dispatchedDate
      });

    // (2) Read NetKg and obtain the associated BookingId and ContractId from the associated Booking
    const cargo = await trx('cargos')
      .select('net_kg', 'booking_id')
      .where('cargo_id', cargoId)
      .first();

    if (!cargo) {
      throw new Error('Cargo not found');
    }

    const netKg = cargo.net_kg;
    const bookingId = cargo.booking_id;

    const booking = await trx('bookings')
      .select('contract_id')
      .where('booking_id', bookingId)
      .first();

    if (!booking) {
      throw new Error('Booking not found');
    }

    const contractId = booking.contract_id;

    // (4) Update the Booking by adding the NetKg to the KgDispatched
    await trx('bookings')
      .where('booking_id', bookingId)
      .increment('kg_dispatched', netKg);

    // Update the Contract by adding the NetKg to the KgDispatched
    await trx('contracts')
      .where('contract_id', contractId)
      .increment('kg_dispatched', netKg);
  });

  return null;
}
