import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import TextBox from '../../components/TextBox.js';
import DateBox from '../../components/DateBox.js';
import ComboBox from '../../components/ComboBox.js';
import NumericBox from '../../components/NumericBox.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';

const HomeTopAction1 = ReactRouterDOM.withRouter(function ({ body, updateBody, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  const getBaseFriendlyNameBodyCustomerId = function () {
    return null;
  }
  
  const loaderBodyCustomerId = async function () {
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
              value={body.code}
              onChange={(value) => updateBody('code', value)}
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
              value={body.date}
              onChange={(value) => updateBody('date', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.customer}
              value={body.customerId}
              onChange={(value) => updateBody('customerId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameBodyCustomerId()}
              loader={loaderBodyCustomerId}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <NumericBox
              label={words.quantityMt}
              value={body.tons}
              onChange={(value) => updateBody('tons', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.deadline}
              value={body.deadline}
              onChange={(value) => updateBody('deadline', value)}
              validated={validated}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default HomeTopAction1;
