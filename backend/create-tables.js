module.exports = async function (knex) {
  try {
    const result = await knex.select('version_number').from('version_control');
    if (result[0].version_number === 1) {
      return;
    }
  }
  catch (err) {
  }
  console.log('Creating Database structure...');
  // Tables
  if (!(await knex.schema.hasTable('bookings'))) {
    await knex.schema.createTable('bookings', function (knexTable) {
      knexTable.increments('booking_id').unsigned().primary();
      knexTable.string('code', 40).notNullable();
      knexTable.integer('contract_id').unsigned().notNullable();
      knexTable.integer('total_cargos').notNullable();
      knexTable.integer('available_cargos').notNullable();
      knexTable.integer('shipper_id').unsigned().notNullable();
      knexTable.date('departure_date').notNullable();
      knexTable.date('arrival_date').notNullable();
      knexTable.string('status', 80).notNullable();
      knexTable.integer('kg_target').notNullable();
      knexTable.integer('kg_dispatched').notNullable();
      knexTable.integer('kg_delivered').notNullable();
      knexTable.decimal('cost', 18, 2).nullable();
    });
  }
  if (!(await knex.schema.hasTable('cargos'))) {
    await knex.schema.createTable('cargos', function (knexTable) {
      knexTable.increments('cargo_id').unsigned().primary();
      knexTable.string('code', 40).notNullable();
      knexTable.integer('booking_id').unsigned().notNullable();
      knexTable.integer('pallets').notNullable();
      knexTable.integer('tare_lb').notNullable();
      knexTable.integer('tare_kg').notNullable();
      knexTable.integer('gross_lb').notNullable();
      knexTable.integer('gross_kg').notNullable();
      knexTable.integer('net_lb').notNullable();
      knexTable.integer('net_kg').notNullable();
      knexTable.integer('transporter_id').unsigned().notNullable();
      knexTable.string('status', 80).notNullable();
      knexTable.date('dispatched_date').nullable();
      knexTable.date('delivered_date').nullable();
      knexTable.string('container_code', 40).nullable();
      knexTable.string('container_seal', 40).nullable();
      knexTable.decimal('base_cost', 18, 2).nullable();
      knexTable.decimal('additional_cost', 18, 2).nullable();
    });
  }
  if (!(await knex.schema.hasTable('contracts'))) {
    await knex.schema.createTable('contracts', function (knexTable) {
      knexTable.increments('contract_id').unsigned().primary();
      knexTable.string('code', 40).notNullable();
      knexTable.date('date').notNullable();
      knexTable.integer('customer_id').unsigned().notNullable();
      knexTable.integer('tons').notNullable();
      knexTable.date('deadline').notNullable();
      knexTable.string('status', 80).notNullable();
      knexTable.integer('kg_target').notNullable();
      knexTable.integer('kg_dispatched').notNullable();
      knexTable.integer('kg_delivered').notNullable();
      knexTable.decimal('base_cost', 18, 2).nullable();
      knexTable.decimal('additional_cost', 18, 2).nullable();
    });
  }
  if (!(await knex.schema.hasTable('customers'))) {
    await knex.schema.createTable('customers', function (knexTable) {
      knexTable.increments('customer_id').unsigned().primary();
      knexTable.string('name', 80).notNullable();
      knexTable.string('phone_number', 15).notNullable();
      knexTable.string('email', 100).notNullable();
    });
  }
  if (!(await knex.schema.hasTable('references'))) {
    await knex.schema.createTable('references', function (knexTable) {
      knexTable.increments('reference_id').unsigned().primary();
      knexTable.integer('contract_id').unsigned().notNullable();
      knexTable.integer('booking_id').unsigned().nullable();
      knexTable.integer('cargo_id').unsigned().nullable();
      knexTable.string('url', 255).notNullable();
    });
  }
  if (!(await knex.schema.hasTable('sessions'))) {
    await knex.schema.createTable('sessions', function (knexTable) {
      knexTable.increments('session_id').unsigned().primary();
      knexTable.integer('user_id').unsigned().notNullable();
      knexTable.string('code', 40).nullable();
      knexTable.string('access_token', 4000).nullable();
      knexTable.string('refresh_token', 800).nullable();
      knexTable.datetime('created_datetime').notNullable();
      knexTable.datetime('last_refreshed_datetime').nullable();
    });
  }
  if (!(await knex.schema.hasTable('shippers'))) {
    await knex.schema.createTable('shippers', function (knexTable) {
      knexTable.increments('shipper_id').unsigned().primary();
      knexTable.string('name', 100).notNullable();
    });
  }
  if (!(await knex.schema.hasTable('transporters'))) {
    await knex.schema.createTable('transporters', function (knexTable) {
      knexTable.increments('transporter_id').unsigned().primary();
      knexTable.string('name', 80).notNullable();
    });
  }
  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', function (knexTable) {
      knexTable.increments('user_id').unsigned().primary();
      knexTable.string('username', 80).notNullable();
      knexTable.string('first_name', 40).nullable();
      knexTable.string('last_name', 40).nullable();
      knexTable.string('email', 400).nullable();
      knexTable.string('avatar', 4000).nullable();
      knexTable.string('provider', 80).nullable();
      knexTable.boolean('enabled').notNullable();
    });
  }
  if (!(await knex.schema.hasTable('users_roles'))) {
    await knex.schema.createTable('users_roles', function (knexTable) {
      knexTable.increments('user_role_id').unsigned().primary();
      knexTable.integer('user_id').unsigned().notNullable();
      knexTable.string('role', 40).notNullable();
    });
  }
  // Foreign Keys
  try {
    await knex.schema.table('bookings', function (knexTable) {
      knexTable.foreign('contract_id').references('contracts.contract_id');
      knexTable.foreign('shipper_id').references('shippers.shipper_id');
    });
  }
  catch (err) {
    console.error(err);
  }
  try {
    await knex.schema.table('cargos', function (knexTable) {
      knexTable.foreign('booking_id').references('bookings.booking_id');
      knexTable.foreign('transporter_id').references('transporters.transporter_id');
    });
  }
  catch (err) {
    console.error(err);
  }
  try {
    await knex.schema.table('contracts', function (knexTable) {
      knexTable.foreign('customer_id').references('customers.customer_id');
    });
  }
  catch (err) {
    console.error(err);
  }
  try {
    await knex.schema.table('references', function (knexTable) {
      knexTable.foreign('contract_id').references('contracts.contract_id');
      knexTable.foreign('booking_id').references('bookings.booking_id');
      knexTable.foreign('cargo_id').references('cargos.cargo_id');
    });
  }
  catch (err) {
    console.error(err);
  }
  try {
    await knex.schema.table('sessions', function (knexTable) {
      knexTable.foreign('user_id').references('users.user_id');
    });
  }
  catch (err) {
    console.error(err);
  }
  try {
    await knex.schema.table('users_roles', function (knexTable) {
      knexTable.foreign('user_id').references('users.user_id');
    });
  }
  catch (err) {
    console.error(err);
  }
  // Unique Keys
  try {
    await knex.schema.table('sessions', function (knexTable) {
      knexTable.unique(['code']);
    });
  }
  catch (err) {
    console.error(err);
  }
  try {
    await knex.schema.table('users_roles', function (knexTable) {
      knexTable.unique(['user_id', 'role']);
    });
  }
  catch (err) {
    console.error(err);
  }
  // Indexes
  // Version Control
  if (!(await knex.schema.hasTable('version_control'))) {
    await knex.schema.createTable('version_control', function (knexTable) {
      knexTable.integer('version_number').unsigned();
    });
  }
  await knex('version_control').insert({ version_number: 1 });
  console.log('Database structure successfully created.');
}
