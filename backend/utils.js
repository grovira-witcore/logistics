// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

module.exports = {
  protect: function (fn, arg) {
    if (fn) {
      try {
        return fn(arg);
      }
      catch (err) {
        console.error(err);
        return null;
      }
    }
    else {
      return null;
    }
  },
  formatDate: function (date) {
    if (date) {
      return new Date(date).toISOString().substring(0, 10);
    }
    else {
      return null;
    }
  },
  formatDatetime: function (datetime) {
    if (datetime) {
      return new Date(datetime).toISOString();
    }
    else {
      return null;
    }
  },
  formatEnumValue: function (enumValue) {
    if (enumValue) {
      return enumValue[0].toUpperCase() + enumValue.substring(1);
    }
    else {
      return null;
    }
  },
  getAuditLogData: function (obj, conversions) {
    try {
      const convertedObj = {};
      if (conversions) {
        for (const key in obj) {
          const conversion = conversions.find(conversionX => conversionX.sourceKey === key);
          if (conversion) {
            convertedObj[conversion.targetKey] = { entityName: conversion.entityName, entityId: obj[key] };
          }
          else {
            convertedObj[key] = obj[key];
          }
        }
      }
      else {
        for (const key in obj) {
          convertedObj[key] = obj[key];
        }
      }
      const json = JSON.stringify(convertedObj);
      if (json.length <= 4000) {
        return json;
      }
      const dataKeys = Object.keys(convertedObj);
      for (let i = dataKeys.length - 1; i >= 0; i--) {
        delete convertedObj[dataKeys[i]];
        const currentJson = JSON.stringify(convertedObj);
        if (currentJson.length <= 4000) {
          return currentJson;
        }
      }
    }
    catch (err) {
      console.error(err);
    }
    return null;
  },
  solveAuditLogsIds: async function (knex, managers, auditLogs) {
    const requestsByEntity = {};
    for (const auditLog of auditLogs) {
      if (auditLog.entityName && auditLog.entityId) {
        let requests = requestsByEntity[auditLog.entityName];
        if (requests === null || requests === undefined) {
          requests = [];
          requestsByEntity[auditLog.entityName] = requests;
        }
        if (requests.indexOf(auditLog.entityId) === -1) {
          requests.push(auditLog.entityId);
        }
      }
      if (auditLog.data) {
        const parsedData = JSON.parse(auditLog.data);
        for (const key in parsedData) {
          const value = parsedData[key];
          if (value && typeof value === 'object' && value.entityName && value.entityId) {
            let requests = requestsByEntity[value.entityName];
            if (requests === null || requests === undefined) {
              requests = [];
              requestsByEntity[value.entityName] = requests;
            }
            if (requests.indexOf(value.entityId) === -1) {
              requests.push(value.entityId);
            }
          }
        }
      }
    }
    const solvedsByEntity = {};
    for (const entityName in requestsByEntity) {
      const manager = managers[entityName];
      if (manager && manager.solveIds) {
        const ids = [...requestsByEntity[entityName]];
        const solveds = [];
        while (ids.length > 20) {
          solveds.push(...await manager.solveIds(knex, ids.slice(0, 20)));
          ids = pendingIds.slice(20);
        }
        if (ids.length > 0) {
          solveds.push(...await manager.solveIds(knex, ids));
        }
        solvedsByEntity[entityName] = solveds;
      }
    }
    const solvedAuditLogs = [];
    for (const auditLog of auditLogs) {
      const solvedAuditLog = { ...auditLog };
      if (solvedAuditLog.entityName && solvedAuditLog.entityId) {
        const entityId = solvedAuditLog.entityId;
        solvedAuditLog.entityId = null;
        const solveds = solvedsByEntity[solvedAuditLog.entityName];
        if (solveds) {
          const solved = solveds.find(solvedX => solvedX[0] === entityId);
          if (solved) {
            solvedAuditLog.entityId = solved[1];
          }
        }
      }
      if (solvedAuditLog.data) {
        solvedAuditLog.data = JSON.parse(solvedAuditLog.data);
        for (const key in solvedAuditLog.data) {
          const value = solvedAuditLog.data[key];
          if (value && typeof value === 'object' && value.entityName && value.entityId) {
            solvedAuditLog.data[key] = null;
            const solveds = solvedsByEntity[value.entityName];
            if (solveds) {
              const solved = solveds.find(solvedX => solvedX[0] === value.entityId);
              if (solved) {
                solvedAuditLog.data[key] = solved[1];
              }
            }
          }
        }
      }
      solvedAuditLogs.push(solvedAuditLog);
    }
    return solvedAuditLogs;
  },
  isUniqueKeyError: function (err) {
    return err.code === 'SQLITE_CONSTRAINT' || // Sqlite
      err.code === 'ER_DUP_ENTRY' || err.code === 'ER_DUP_KEY' || // Mysql
      err.code === '23505' || // Postgres
      err.code === 'ORA-00001' || err.code === 'ORA-02291'; // Oracle
  },
  isForeignKeyError: function (err) {
    return err.code === 'SQLITE_CONSTRAINT' || // Sqlite
      err.code === 'ER_ROW_IS_REFERENCED_2' || // Mysql
      err.code === '23503' || // Postgres
      err.code === 'ORA-02292'; // Oracle
  }
}