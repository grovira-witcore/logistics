const Utils = require('../utils.js');

const transporterInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.name !== undefined) {
    insertData.name = data.name;
  }
  let id = null;
  try {
    const [inserted] = await trx('transporters')
      .insert(insertData)
      .returning('transporter_id');
    id = (typeof inserted === 'object') ? inserted.transporter_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert Transporter');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const transporterUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  try {
    await trx('transporters')
      .where('transporter_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const transporterDelete = async function (trx, ctx, id) {
  try {
    await trx('transporters')
      .where('transporter_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete Transporter');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const transporterSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.transporter_id as transporterId',
      't0.name as name'
    )
    .from('transporters as t0')
    .whereIn(knex.raw('t0.transporter_id'), ids);
  return (await knexQuery).map(instance => [
    instance.transporterId,
    instance.name
  ]);
}

module.exports = {
  insert: transporterInsert,
  update: transporterUpdate,
  delete: transporterDelete,
  solveIds: transporterSolveIds,
}
