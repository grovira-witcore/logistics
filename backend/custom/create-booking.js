// Must accept a request body with an object containing { Code, ContractId,
// TotalCargos, ShipperId, DepartureDate, and ArrivalDate }. It should create a
// Booking in the database setting those values plus: AvailableCargos = TotalCargos,
// Status = 'inProgress' (Enum BookingStatus), KgTarget = TotalCargos * 20000,
// KgDelivered = 0, KgDispatched = 0.
const RecalculateContractCosts = require('./recalculate-contract-costs.js');

module.exports = async function ({ knex, ctx, data, managers, saveAuditLog }) {
  const { code, contractId, totalCargos, shipperId, departureDate, arrivalDate, cost } = data;

  // Validate the request body
  if (!code || !contractId || !totalCargos || !shipperId || !departureDate || !arrivalDate) {
    throw new Error('Missing required fields');
  }

  // Calculate additional fields
  const availableCargos = totalCargos;
  const status = 'inProgress'; // Enum BookingStatus
  const kgTarget = totalCargos * 20000;
  const kgDelivered = 0;
  const kgDispatched = 0;

  // Insert the new booking into the database
  const bookingId = await managers.booking.insert(knex, ctx, {
    code,
    contractId,
    totalCargos,
    availableCargos,
    shipperId,
    departureDate,
    arrivalDate,
    status,
    kgTarget,
    kgDelivered,
    kgDispatched,
    cost
  });

  await RecalculateContractCosts(knex, contractId);

  await saveAuditLog(knex, bookingId)

  // Return the response with the new bookingId
  return { bookingId };
}
