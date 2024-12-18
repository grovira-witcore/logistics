const Utils = require('../utils.js');

const customerInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.name !== undefined) {
    insertData.name = data.name;
  }
  if (data.phoneNumber !== undefined) {
    insertData.phone_number = data.phoneNumber;
  }
  if (data.email !== undefined) {
    insertData.email = data.email;
  }
  let id = null;
  try {
    const [inserted] = await trx('customers')
      .insert(insertData)
      .returning('customer_id');
    id = (typeof inserted === 'object') ? inserted.customer_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert Customer');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const customerUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.phoneNumber !== undefined) {
    updateData.phone_number = data.phoneNumber;
  }
  if (data.email !== undefined) {
    updateData.email = data.email;
  }
  try {
    await trx('customers')
      .where('customer_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const customerDelete = async function (trx, ctx, id) {
  try {
    await trx('customers')
      .where('customer_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete Customer');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const customerSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.customer_id as customerId',
      't0.name as name'
    )
    .from('customers as t0')
    .whereIn(knex.raw('t0.customer_id'), ids);
  return (await knexQuery).map(instance => [
    instance.customerId,
    instance.name
  ]);
}

module.exports = {
  insert: customerInsert,
  update: customerUpdate,
  delete: customerDelete,
  solveIds: customerSolveIds,
}
