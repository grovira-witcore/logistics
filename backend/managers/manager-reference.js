const Utils = require('../utils.js');

const referenceInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.contractId !== undefined) {
    insertData.contract_id = data.contractId;
  }
  if (data.bookingId !== undefined) {
    insertData.booking_id = data.bookingId;
  }
  if (data.cargoId !== undefined) {
    insertData.cargo_id = data.cargoId;
  }
  if (data.url !== undefined) {
    insertData.url = data.url;
  }
  let id = null;
  try {
    const [inserted] = await trx('references')
      .insert(insertData)
      .returning('reference_id');
    id = (typeof inserted === 'object') ? inserted.reference_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert Reference');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const referenceUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.contractId !== undefined) {
    updateData.contract_id = data.contractId;
  }
  if (data.bookingId !== undefined) {
    updateData.booking_id = data.bookingId;
  }
  if (data.cargoId !== undefined) {
    updateData.cargo_id = data.cargoId;
  }
  if (data.url !== undefined) {
    updateData.url = data.url;
  }
  try {
    await trx('references')
      .where('reference_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const referenceDelete = async function (trx, ctx, id) {
  try {
    await trx('references')
      .where('reference_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete Reference');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const referenceSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.reference_id as referenceId',
      't0.url as url'
    )
    .from('references as t0')
    .whereIn(knex.raw('t0.reference_id'), ids);
  return (await knexQuery).map(instance => [
    instance.referenceId,
    instance.url
  ]);
}

module.exports = {
  insert: referenceInsert,
  update: referenceUpdate,
  delete: referenceDelete,
  solveIds: referenceSolveIds,
}
