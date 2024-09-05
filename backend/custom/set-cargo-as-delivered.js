// Given a CargoId received in the path, receive a body with { DeliveredDate,
// ContainerCode, and ContainerSeal } and (1) update the Cargo setting Status =
// 'delivered', DeliveredDate = the received value, ContainerCode = the received
// value, and ContainerSeal = the received value; (2) read NetKg and obtain the
// BookingId associated and the ContractId associated with the associated Booking;
// (3) update the Booking and the Contract by adding the NetKg to the KgDelivered of
// each of these tables.

module.exports = async function (knex, req, res) {
  const cargoId = parseInt(req.params.cargoId);
  const { deliveredDate, containerCode, containerSeal } = req.body;

  try {
    // Step 1: Update the cargo
    await knex('cargos')
      .where('cargo_id', cargoId)
      .update({
        status: 'delivered',
        delivered_date: deliveredDate,
        container_code: containerCode,
        container_seal: containerSeal
      });

    // Step 2: Retrieve net_kg, booking_id, and contract_id
    const cargo = await knex('cargos')
      .select('net_kg', 'booking_id')
      .where('cargo_id', cargoId)
      .first();

    if (!cargo) {
      return res.status(404).send({ error: 'Cargo not found' });
    }

    const { net_kg, booking_id } = cargo;
    const booking = await knex('bookings')
      .select('contract_id')
      .where('booking_id', booking_id)
      .first();

    if (!booking) {
      return res.status(404).send({ error: 'Booking not found' });
    }

    const { contract_id } = booking;

    // Step 3: Update the bookings
    await knex('bookings')
      .where('booking_id', booking_id)
      .increment('kg_delivered', net_kg);

    const booking2 = await knex('bookings')
      .select('kg_target', 'kg_delivered')
      .where('booking_id', booking_id)
      .first();

    if (booking2.kg_target <= booking2.kg_delivered) {
      await knex('bookings')
        .where('booking_id', booking_id)
        .update({
          status: 'completed'
        });
    }

    // Step 3: Update the contracts
    await knex('contracts')
      .where('contract_id', contract_id)
      .increment('kg_delivered', net_kg);

    const contract2 = await knex('bookings')
      .select('kg_target', 'kg_delivered')
      .where('contract_id', contract_id)
      .first();

    if (contract2.kg_target <= contract2.kg_delivered) {
      await knex('bookings')
        .where('contract_id', contract_id)
        .update({
          status: 'completed'
        });
    }

    res.status(200).send({ message: 'Cargo and associated records updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while processing your request' });
  }
}
