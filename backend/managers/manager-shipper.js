const Utils = require('../utils.js');

const shipperInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.name !== undefined) {
    insertData.name = data.name;
  }
  let id = null;
  try {
    const [inserted] = await trx('shippers')
      .insert(insertData)
      .returning('shipper_id');
    id = (typeof inserted === 'object') ? inserted.shipper_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert Shipper');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const shipperUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  try {
    await trx('shippers')
      .where('shipper_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const shipperDelete = async function (trx, ctx, id) {
  try {
    await trx('shippers')
      .where('shipper_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete Shipper');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const shipperSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.shipper_id as shipperId',
      't0.name as name'
    )
    .from('shippers as t0')
    .whereIn(knex.raw('t0.shipper_id'), ids);
  return (await knexQuery).map(instance => [
    instance.shipperId,
    instance.name
  ]);
}

module.exports = {
  insert: shipperInsert,
  update: shipperUpdate,
  delete: shipperDelete,
  solveIds: shipperSolveIds,
}
