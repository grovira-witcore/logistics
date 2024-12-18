// Must create a Contract in the database using the data from the request body: {
// Code, Date, CustomerId, Tons, Deadline }. The Contract entity must also set
// Status to 'inProgress' (Enum ContractStatus), KgTarget to Tons * 1000,
// KgDelivered to 0, and KgDispatched to 0.

module.exports = async function ({ knex, ctx, data }) {
  const { code, date, customerId, tons, deadline } = data;

  // Perform input validation if necessary (e.g., checking for non-null values)

  // Calculate kg_target
  const kgTarget = tons * 1000;

  // Insert the new contract into the database
  const [contractId] = await knex('contracts').insert({
    code: code,
    date: date,
    customer_id: customerId,
    tons: tons,
    deadline: deadline,
    status: 'inProgress',
    kg_target: kgTarget,
    kg_delivered: 0,
    kg_dispatched: 0,
    base_cost: 0,
    additional_cost: 0
  }, 'contract_id');

  // Return the newly created contract ID as a response
  return { contractId };
}
