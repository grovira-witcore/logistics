import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import TextBox from '../../components/TextBox.js';
import DateBox from '../../components/DateBox.js';
import ComboBox from '../../components/ComboBox.js';
import NumericBox from '../../components/NumericBox.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';

const ContractsBodyAction1 = ReactRouterDOM.withRouter(function ({ data, updateData, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  const getBaseFriendlyNameCustomerId = function () {
    return null;
  }
  
  const loaderCustomerId = async function () {
    let records = null;
    try {
      const args = {};
      records = await ApiService.getCustomers(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.customerId, record.name]);
  }
  
  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.referenceNumber}
              value={data.code}
              onChange={(value) => updateData('code', value)}
              validated={validated}
              maxLength={50}
              required={true}
              focus
            />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.date}
              value={data.date}
              onChange={(value) => updateData('date', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.customer}
              value={data.customerId}
              onChange={(value) => updateData('customerId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameCustomerId()}
              loader={loaderCustomerId}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <NumericBox
              label={words.quantityMt}
              value={data.tons}
              onChange={(value) => updateData('tons', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.deadline}
              value={data.deadline}
              onChange={(value) => updateData('deadline', value)}
              validated={validated}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default ContractsBodyAction1;
