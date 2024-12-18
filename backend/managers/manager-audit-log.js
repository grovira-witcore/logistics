const Utils = require('../utils.js');

const auditLogInsert = async function (trx, ctx, data) {
  if (process.env.ENABLE_AUDIT_LOGS !== 'true') {
    return null;
  }
  const insertData = {};
  insertData.datetime = new Date();
  insertData.user_id = ctx.userId;
  if (data.entityName !== undefined) {
    insertData.entity_name = data.entityName;
  }
  if (data.entityId !== undefined) {
    insertData.entity_id = data.entityId;
  }
  if (data.actionName !== undefined) {
    insertData.action_name = data.actionName;
  }
  if (data.data !== undefined) {
    insertData.data = data.data;
  }
  let id = null;
  try {
    const [inserted] = await trx('audit_logs')
      .insert(insertData)
      .returning('audit_log_id');
    id = (typeof inserted === 'object') ? inserted.audit_log_id : inserted;
  }
  catch (err) {
    if (Utils.isUniqueKeyError(err)) {
      const newErr = new Error('Unique key constraint fails trying to insert AuditLog');
      newErr.translationKey = 'cannotCreateThisObjectBecauseItAlreadyExists';
      throw newErr;
    }
    else {
      throw err;
    }
  }
  return id;
}

module.exports = {
  insert: auditLogInsert,
}
