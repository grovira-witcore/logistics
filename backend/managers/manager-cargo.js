const Utils = require('../utils.js');

const cargoInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.code !== undefined) {
    insertData.code = data.code;
  }
  if (data.bookingId !== undefined) {
    insertData.booking_id = data.bookingId;
  }
  if (data.pallets !== undefined) {
    insertData.pallets = data.pallets;
  }
  if (data.tareLb !== undefined) {
    insertData.tare_lb = data.tareLb;
  }
  if (data.tareKg !== undefined) {
    insertData.tare_kg = data.tareKg;
  }
  if (data.grossLb !== undefined) {
    insertData.gross_lb = data.grossLb;
  }
  if (data.grossKg !== undefined) {
    insertData.gross_kg = data.grossKg;
  }
  if (data.netLb !== undefined) {
    insertData.net_lb = data.netLb;
  }
  if (data.netKg !== undefined) {
    insertData.net_kg = data.netKg;
  }
  if (data.transporterId !== undefined) {
    insertData.transporter_id = data.transporterId;
  }
  if (data.status !== undefined) {
    insertData.status = data.status;
  }
  if (data.dispatchedDate !== undefined) {
    insertData.dispatched_date = data.dispatchedDate ? new Date(data.dispatchedDate) : null;
  }
  if (data.deliveredDate !== undefined) {
    insertData.delivered_date = data.deliveredDate ? new Date(data.deliveredDate) : null;
  }
  if (data.containerCode !== undefined) {
    insertData.container_code = data.containerCode;
  }
  if (data.containerSeal !== undefined) {
    insertData.container_seal = data.containerSeal;
  }
  if (data.baseCost !== undefined) {
    insertData.base_cost = data.baseCost;
  }
  if (data.additionalCost !== undefined) {
    insertData.additional_cost = data.additionalCost;
  }
  let id = null;
  try {
    const [inserted] = await trx('cargos')
      .insert(insertData)
      .returning('cargo_id');
    id = (typeof inserted === 'object') ? inserted.cargo_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert Cargo');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const cargoUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.code !== undefined) {
    updateData.code = data.code;
  }
  if (data.bookingId !== undefined) {
    updateData.booking_id = data.bookingId;
  }
  if (data.pallets !== undefined) {
    updateData.pallets = data.pallets;
  }
  if (data.tareLb !== undefined) {
    updateData.tare_lb = data.tareLb;
  }
  if (data.tareKg !== undefined) {
    updateData.tare_kg = data.tareKg;
  }
  if (data.grossLb !== undefined) {
    updateData.gross_lb = data.grossLb;
  }
  if (data.grossKg !== undefined) {
    updateData.gross_kg = data.grossKg;
  }
  if (data.netLb !== undefined) {
    updateData.net_lb = data.netLb;
  }
  if (data.netKg !== undefined) {
    updateData.net_kg = data.netKg;
  }
  if (data.transporterId !== undefined) {
    updateData.transporter_id = data.transporterId;
  }
  if (data.status !== undefined) {
    updateData.status = data.status;
  }
  if (data.dispatchedDate !== undefined) {
    updateData.dispatched_date = data.dispatchedDate ? new Date(data.dispatchedDate) : null;
  }
  if (data.deliveredDate !== undefined) {
    updateData.delivered_date = data.deliveredDate ? new Date(data.deliveredDate) : null;
  }
  if (data.containerCode !== undefined) {
    updateData.container_code = data.containerCode;
  }
  if (data.containerSeal !== undefined) {
    updateData.container_seal = data.containerSeal;
  }
  if (data.baseCost !== undefined) {
    updateData.base_cost = data.baseCost;
  }
  if (data.additionalCost !== undefined) {
    updateData.additional_cost = data.additionalCost;
  }
  try {
    await trx('cargos')
      .where('cargo_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const cargoDelete = async function (trx, ctx, id) {
  try {
    await trx('cargos')
      .where('cargo_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete Cargo');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const cargoSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.cargo_id as cargoId',
      't0.code as code'
    )
    .from('cargos as t0')
    .whereIn(knex.raw('t0.cargo_id'), ids);
  return (await knexQuery).map(instance => [
    instance.cargoId,
    instance.code
  ]);
}

module.exports = {
  insert: cargoInsert,
  update: cargoUpdate,
  delete: cargoDelete,
  solveIds: cargoSolveIds,
}
