require('dotenv').config();

const Knex = require('knex');
const Express = require('express');
const Pg = require('pg');
const WaitDatabase = require('./wait-database.js');
const CreateTables = require('./create-tables.js');
const CreateEndpoints = require('./create-endpoints.js');

const PORT = process.env.TARGET_PORT || 4000;

(async function () {
  // Pg
  Pg.types.setTypeParser(1700, function(value) {
    return parseFloat(value);
  });
  // Knex
  const knex = Knex({
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    },
    useNullAsDefault: true
  });
  await WaitDatabase(knex);
  await CreateTables(knex);
  if (process.env.ADMIN_USERNAME) {
    const users = await knex
      .select('user_id')
      .from('users')
      .where('username', '=', process.env.ADMIN_USERNAME);
    if (users.length === 0) {
      const [insertResult] = await knex('users')
        .insert({
          username: process.env.ADMIN_USERNAME,
          first_name: process.env.ADMIN_FIRST_NAME ?? null,
          last_name: process.env.ADMIN_LAST_NAME ?? null,
          enabled: true
        })
        .returning('user_id');
      const userId = typeof insertResult === 'object' ? insertResult.user_id : insertResult;
      await knex('users_roles')
        .insert({
          user_id: userId,
          role: 'administrator'
        });
    }
  }
  // Express
  const express = Express();
  express.use(Express.json());
  await CreateEndpoints(knex, express, ['administrator']);
  express.listen(PORT, () => {
    console.log('Listening...');
  });
})();
