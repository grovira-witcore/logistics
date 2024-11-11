require('dotenv').config();

const Knex = require('knex');
const Express = require('express');
const Pg = require('pg');
const WaitDatabase = require('./wait-database.js');
const CreateTables = require('./create-tables.js');
const CreateEndpoints = require('./create-endpoints.js');
const Security = require('./security/security.js');

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
      password: process.env.POSTGRES_PASSWORD,
      ssl: (process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : null)
    },
    useNullAsDefault: true
  });
  await WaitDatabase(knex);
  await CreateTables(knex);
  await Security.initDatabase(knex, ['administrator']);
  // Express
  const express = Express();
  express.use(Express.json());
  await CreateEndpoints(knex, express, ['administrator']);
  express.listen(PORT, () => {
    console.log('Listening...');
  });
})();
