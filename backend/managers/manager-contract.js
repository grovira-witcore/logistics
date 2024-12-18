const Utils = require('../utils.js');

const contractInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.code !== undefined) {
    insertData.code = data.code;
  }
  if (data.date !== undefined) {
    insertData.date = data.date ? new Date(data.date) : null;
  }
  if (data.customerId !== undefined) {
    insertData.customer_id = data.customerId;
  }
  if (data.tons !== undefined) {
    insertData.tons = data.tons;
  }
  if (data.deadline !== undefined) {
    insertData.deadline = data.deadline ? new Date(data.deadline) : null;
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
  if (data.baseCost !== undefined) {
    insertData.base_cost = data.baseCost;
  }
  if (data.additionalCost !== undefined) {
    insertData.additional_cost = data.additionalCost;
  }
  let id = null;
  try {
    const [inserted] = await trx('contracts')
      .insert(insertData)
      .returning('contract_id');
    id = (typeof inserted === 'object') ? inserted.contract_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert Contract');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const contractUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.code !== undefined) {
    updateData.code = data.code;
  }
  if (data.date !== undefined) {
    updateData.date = data.date ? new Date(data.date) : null;
  }
  if (data.customerId !== undefined) {
    updateData.customer_id = data.customerId;
  }
  if (data.tons !== undefined) {
    updateData.tons = data.tons;
  }
  if (data.deadline !== undefined) {
    updateData.deadline = data.deadline ? new Date(data.deadline) : null;
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
  if (data.baseCost !== undefined) {
    updateData.base_cost = data.baseCost;
  }
  if (data.additionalCost !== undefined) {
    updateData.additional_cost = data.additionalCost;
  }
  try {
    await trx('contracts')
      .where('contract_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const contractDelete = async function (trx, ctx, id) {
  try {
    await trx('bookings')
      .where('contract_id', '=', id)
      .delete();
    await trx('references')
      .where('contract_id', '=', id)
      .delete();
    await trx('contracts')
      .where('contract_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete Contract');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const contractSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.contract_id as contractId',
      't0.code as code'
    )
    .from('contracts as t0')
    .whereIn(knex.raw('t0.contract_id'), ids);
  return (await knexQuery).map(instance => [
    instance.contractId,
    instance.code
  ]);
}

module.exports = {
  insert: contractInsert,
  update: contractUpdate,
  delete: contractDelete,
  solveIds: contractSolveIds,
}
