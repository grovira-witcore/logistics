const Utils = require('../utils.js');

const userInsert = async function (trx, ctx, data) {
  const insertData = {};
  if (data.username !== undefined) {
    insertData.username = data.username;
  }
  if (data.firstName !== undefined) {
    insertData.first_name = data.firstName;
  }
  if (data.lastName !== undefined) {
    insertData.last_name = data.lastName;
  }
  if (data.email !== undefined) {
    insertData.email = data.email;
  }
  if (data.avatar !== undefined) {
    insertData.avatar = data.avatar;
  }
  if (data.role !== undefined) {
    insertData.role = data.role;
  }
  let id = null;
  try {
    const [inserted] = await trx('users')
      .insert(insertData)
      .returning('user_id');
    id = (typeof inserted === 'object') ? inserted.user_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert User');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

const userUpdate = async function (trx, ctx, id, data) {
  const updateData = {};
  if (data.username !== undefined) {
    updateData.username = data.username;
  }
  if (data.firstName !== undefined) {
    updateData.first_name = data.firstName;
  }
  if (data.lastName !== undefined) {
    updateData.last_name = data.lastName;
  }
  if (data.email !== undefined) {
    updateData.email = data.email;
  }
  if (data.avatar !== undefined) {
    updateData.avatar = data.avatar;
  }
  if (data.role !== undefined) {
    updateData.role = data.role;
  }
  try {
    await trx('users')
      .where('user_id', '=', id)
      .update(updateData);
  }
  catch (err) {
    throw err;
  }
}

const userDelete = async function (trx, ctx, id) {
  try {
    await trx('users')
      .where('user_id', '=', id)
      .delete();
  }
  catch (err) {
    if (Utils.isForeignKeyError(err)) {
      const newErr = new Error('Foreign key constraint fails trying to delete User');
      newErr.translationKey = 'cannotDeleteThisObjectBecauseItHasRelations';
      throw newErr;
    }
    else {
      throw err;
    }
  }
}

const userSolveIds = async function (knex, ids) {
  let knexQuery = knex
    .select(
      't0.user_id as userId',
      't0.first_name as firstName',
      't0.last_name as lastName'
    )
    .from('users as t0')
    .whereIn(knex.raw('t0.user_id'), ids);
  return (await knexQuery).map(instance => [
    instance.userId,
    Utils.protect(function ([firstName, lastName]) { return `${firstName ?? ''} ${lastName ?? ''}` }, [ instance.firstName, instance.lastName ])
  ]);
}

module.exports = {
  insert: userInsert,
  update: userUpdate,
  delete: userDelete,
  solveIds: userSolveIds,
}
