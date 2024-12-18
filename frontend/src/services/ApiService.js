import SecurityService from './SecurityService.js';

function httpCall(url, method, data) {
  return new Promise(function (resolve) {
    SecurityService.updateToken(async function () {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SecurityService.getToken()}`,
        }
      };
      if (data) {
        options.body = JSON.stringify(data);
      }
      resolve(await fetch(url, options));
    });
  });
}

async function getBooking(bookingId) {
  const response = await httpCall(`/api/booking/${bookingId}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getBooking"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function postCargo(data) {
  const response = await httpCall(`/api/cargo`, 'post', data);
  if (!response.ok) {
    const error = new Error('Error executing "postCargo"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCargos(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/cargos${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCargos"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCountCargos(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-cargos${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountCargos"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function getCargo(cargoId) {
  const response = await httpCall(`/api/cargo/${cargoId}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCargo"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function putCargoAsDispatched(cargoId, data) {
  const response = await httpCall(`/api/cargo/${cargoId}/as-dispatched`, 'put', data);
  if (!response.ok) {
    const error = new Error('Error executing "putCargoAsDispatched"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function putCargoAsDelivered(cargoId, data) {
  const response = await httpCall(`/api/cargo/${cargoId}/as-delivered`, 'put', data);
  if (!response.ok) {
    const error = new Error('Error executing "putCargoAsDelivered"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getTransporters(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/transporters${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getTransporters"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function postReference(reference) {
  const response = await httpCall(`/api/reference`, 'post', reference);
  if (!response.ok) {
    const error = new Error('Error executing "postReference"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).id;
}

async function getReferences(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/references${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getReferences"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCountReferences(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-references${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountReferences"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function getContracts(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/contracts${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getContracts"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getBookings(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/bookings${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getBookings"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCountBookings(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-bookings${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountBookings"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function getShippers(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/shippers${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getShippers"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function putCargoAdditionalCost(cargoId, data) {
  const response = await httpCall(`/api/cargo/${cargoId}/additional-cost`, 'put', data);
  if (!response.ok) {
    const error = new Error('Error executing "putCargoAdditionalCost"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getContract(contractId) {
  const response = await httpCall(`/api/contract/${contractId}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getContract"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function postBooking(data) {
  const response = await httpCall(`/api/booking`, 'post', data);
  if (!response.ok) {
    const error = new Error('Error executing "postBooking"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function postContract(data) {
  const response = await httpCall(`/api/contract`, 'post', data);
  if (!response.ok) {
    const error = new Error('Error executing "postContract"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCountContracts(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-contracts${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountContracts"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function getCustomers(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/customers${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCustomers"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getBookingsV2(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/bookings/v2${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getBookingsV2"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCargosV2(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/cargos/v2${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCargosV2"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCountCargosV2(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-cargos/v2${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountCargosV2"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function postCustomer(customer) {
  const response = await httpCall(`/api/customer`, 'post', customer);
  if (!response.ok) {
    const error = new Error('Error executing "postCustomer"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).id;
}

async function getCountCustomers(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-customers${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountCustomers"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function getCustomer(customerId) {
  const response = await httpCall(`/api/customer/${customerId}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCustomer"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function putCustomer(customerId, updatedCustomerData) {
  const response = await httpCall(`/api/customer/${customerId}`, 'put', updatedCustomerData);
  if (!response.ok) {
    const error = new Error('Error executing "putCustomer"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return null;
}

async function deleteCustomer(customerId) {
  const response = await httpCall(`/api/customer/${customerId}`, 'delete');
  if (!response.ok) {
    const error = new Error('Error executing "deleteCustomer"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return null;
}

async function getContractsV2(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/contracts/v2${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getContractsV2"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function getCountContractsV2(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-contracts/v2${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountContractsV2"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function postShipper(shipper) {
  const response = await httpCall(`/api/shipper`, 'post', shipper);
  if (!response.ok) {
    const error = new Error('Error executing "postShipper"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).id;
}

async function getCountShippers(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-shippers${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountShippers"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function getShipper(shipperId) {
  const response = await httpCall(`/api/shipper/${shipperId}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getShipper"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function putShipper(shipperId, updatedShipperData) {
  const response = await httpCall(`/api/shipper/${shipperId}`, 'put', updatedShipperData);
  if (!response.ok) {
    const error = new Error('Error executing "putShipper"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return null;
}

async function deleteShipper(shipperId) {
  const response = await httpCall(`/api/shipper/${shipperId}`, 'delete');
  if (!response.ok) {
    const error = new Error('Error executing "deleteShipper"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return null;
}

async function postTransporter(transporter) {
  const response = await httpCall(`/api/transporter`, 'post', transporter);
  if (!response.ok) {
    const error = new Error('Error executing "postTransporter"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).id;
}

async function getCountTransporters(args) {
  let queryString = '';
  if (args) {
    queryString = '?' + new URLSearchParams(args).toString();
  }
  const response = await httpCall(`/api/count-transporters${queryString}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getCountTransporters"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return (await response.json()).count;
}

async function getTransporter(transporterId) {
  const response = await httpCall(`/api/transporter/${transporterId}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getTransporter"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

async function putTransporter(transporterId, updatedTransporterData) {
  const response = await httpCall(`/api/transporter/${transporterId}`, 'put', updatedTransporterData);
  if (!response.ok) {
    const error = new Error('Error executing "putTransporter"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return null;
}

async function deleteTransporter(transporterId) {
  const response = await httpCall(`/api/transporter/${transporterId}`, 'delete');
  if (!response.ok) {
    const error = new Error('Error executing "deleteTransporter"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return null;
}

async function getOmniSearch(value) {
  const response = await httpCall(`/api/omni-search/${value}`, 'get');
  if (!response.ok) {
    const error = new Error('Error executing "getOmniSearch"');
    try {
      error.additionalData = await response.json();
    }
    catch (err) {
    }
    throw error;
  }
  return await response.json();
}

const ApiService = {
  getBooking,
  postCargo,
  getCargos,
  getCountCargos,
  getCargo,
  putCargoAsDispatched,
  putCargoAsDelivered,
  getTransporters,
  postReference,
  getReferences,
  getCountReferences,
  getContracts,
  getBookings,
  getCountBookings,
  getShippers,
  putCargoAdditionalCost,
  getContract,
  postBooking,
  postContract,
  getCountContracts,
  getCustomers,
  getBookingsV2,
  getCargosV2,
  getCountCargosV2,
  postCustomer,
  getCountCustomers,
  getCustomer,
  putCustomer,
  deleteCustomer,
  getContractsV2,
  getCountContractsV2,
  postShipper,
  getCountShippers,
  getShipper,
  putShipper,
  deleteShipper,
  postTransporter,
  getCountTransporters,
  getTransporter,
  putTransporter,
  deleteTransporter,
  getOmniSearch,
}

export default ApiService;
