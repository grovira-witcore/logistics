const pingDatabase = async function (knex, last) {
  try {
    await knex.raw('SELECT 1 AS result');
    return true;
  }
  catch (err) {
    if (last) {
      await knex.destroy();
      console.error('Database connection failed after max attempts.');
      throw err;
    }
    else {
      return false;
    }
  }
}

module.exports = async function (knex) {
  console.log('Testing Database connection...');
  const timeout = 30000;
  const interval = 3000;
  const maxAttempts = Math.floor(timeout / interval);
  let attempt = 0;
  while (attempt < maxAttempts) {
    if (await pingDatabase(knex, false)) {
      console.log('Database connection successful.');
      return;
    }
    console.log(`Attempt ${attempt + 1} failed. Retrying in ${interval / 1000} seconds...`);
    attempt++;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  await pingDatabase(knex, true);
  console.log('Database connection successful.');
}
