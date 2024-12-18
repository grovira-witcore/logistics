const Utils = require('../utils.js');

const bookingInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.code !== undefined) {
    insertData.code = data.code;
  }
  if (data.contractId !== undefined) {
    insertData.contract_id = data.contractId;
  }
  if (data.totalCargos !== undefined) {
    insertData.total_cargos = data.totalCargos;
  }
  if (data.availableCargos !== undefined) {
    insertData.available_cargos = data.availableCargos;
  }
  if (data.shipperId !== undefined) {
    insertData.shipper_id = data.shipperId;
  }
  if (data.departureDate !== undefined) {
    insertData.departure_date = data.departureDate ? new Date(data.departureDate) : null;
  }
  if (data.arrivalDate !== undefined) {
    insertData.arrival_date = data.arrivalDate ? new Date(data.arrivalDate) : null;
  }
  if (data.status !== undefined) {
    insertData.status = data.status;
  }
  if (data.kgTarget !== undefined) {
    insertData.kg_target = data.kgTarget;
  }
  if (data.kgDispatched !== undefined) {
    insertData.kg_dispatched = data.kgDispatched;
  }
  if (data.kgDelivered !== undefined) {
    insertData.kg_delivered = data.kgDelivered;
  }
  if (data.cost !== undefined) {
    insertData.cost = data.cost;
  }
  let id = null;
  try {
    const [inserted] = await trx('bookings')
      .insert(insertData)
      .returning('booking_id');
    id = (typeof inserted === 'object') ? inserted.booking_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert Booking');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const bookingUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.code !== undefined) {
    updateData.code = data.code;
  }
  if (data.contractId !== undefined) {
    updateData.contract_id = data.contractId;
  }
  if (data.totalCargos !== undefined) {
    updateData.total_cargos = data.totalCargos;
  }
  if (data.availableCargos !== undefined) {
    updateData.available_cargos = data.availableCargos;
  }
  if (data.shipperId !== undefined) {
    updateData.shipper_id = data.shipperId;
  }
  if (data.departureDate !== undefined) {
    updateData.departure_date = data.departureDate ? new Date(data.departureDate) : null;
  }
  if (data.arrivalDate !== undefined) {
    updateData.arrival_date = data.arrivalDate ? new Date(data.arrivalDate) : null;
  }
  if (data.status !== undefined) {
    updateData.status = data.status;
  }
  if (data.kgTarget !== undefined) {
    updateData.kg_target = data.kgTarget;
  }
  if (data.kgDispatched !== undefined) {
    updateData.kg_dispatched = data.kgDispatched;
  }
  if (data.kgDelivered !== undefined) {
    updateData.kg_delivered = data.kgDelivered;
  }
  if (data.cost !== undefined) {
    updateData.cost = data.cost;
  }
  try {
    await trx('bookings')
      .where('booking_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const bookingDelete = async function (trx, ctx, id) {
  try {
    await trx('bookings')
      .where('booking_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete Booking');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const bookingSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.booking_id as bookingId',
      't0.code as code'
    )
    .from('bookings as t0')
    .whereIn(knex.raw('t0.booking_id'), ids);
  return (await knexQuery).map(instance => [
    instance.bookingId,
    instance.code
  ]);
}

module.exports = {
  insert: bookingInsert,
  update: bookingUpdate,
  delete: bookingDelete,
  solveIds: bookingSolveIds,
}
