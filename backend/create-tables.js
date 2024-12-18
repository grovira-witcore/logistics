module.exports = async function (knex) {
  try {
    const result = await knex.select('version_number').from('version_control');
    if (result[0].version_number === 1) {
      return;
    }
  }
  catch (err) {
  }
  console.log('Creating Database Structure...');
  // Tables
  if (!(await knex.schema.hasTable('audit_logs'))) {
    await knex.schema.createTable('audit_logs', function (knexTable) {
      knexTable.bigIncrements('audit_log_id').unsigned().primary();
      knexTable.datetime('datetime').notNullable();
      knexTable.integer('user_id').unsigned().notNullable();
      knexTable.string('entity_name', 200).nullable();
      knexTable.bigInteger('entity_id').nullable();
      knexTable.string('action_name', 200).notNullable();
      knexTable.string('data', 4000).nullable();
    });
  }
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
      knexTable.string('role', 80).notNullable();
    });
  }
  // Foreign Keys
  try {
    await knex.schema.table('audit_logs', function (knexTable) {
      knexTable.foreign('user_id').references('users.user_id');
    });
  }
  catch (err) {
    console.error(err);
  }
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
  // Unique Keys
  try {
    await knex.schema.table('users', function (knexTable) {
      knexTable.unique(['username']);
    });
  }
  catch (err) {
    console.error(err);
  }
  // Indexes
  try {
    await knex.raw('CREATE INDEX audit_logs_datetime_index ON audit_logs (datetime)');
    try {
      await knex.raw('CREATE INDEX audit_logs_entity_name_entity_id_index ON audit_logs (LOWER(entity_name), entity_id)');
    }
    catch (ignErr) {
      await knex.raw('CREATE INDEX audit_logs_entity_name_entity_id_index ON audit_logs (entity_name, entity_id)');
    }
  }
  catch (err) {
    console.error(err);
  }
  // Version Control
  if (!(await knex.schema.hasTable('version_control'))) {
    await knex.schema.createTable('version_control', function (knexTable) {
      knexTable.integer('version_number').unsigned();
    });
  }
  await knex('version_control').insert({ version_number: 1 });
  console.log('Database Structure successfully created.');
}
