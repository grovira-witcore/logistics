import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import TextBox from '../../components/TextBox.js';
import NumericBox from '../../components/NumericBox.js';
import ComboBox from '../../components/ComboBox.js';
import MoneyBox from '../../components/MoneyBox.js';
import DateBox from '../../components/DateBox.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';

const ContractLeft2Action1 = ReactRouterDOM.withRouter(function ({ contract, body, updateBody, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  const getBaseFriendlyNameBodyShipperId = function () {
    return null;
  }
  
  const loaderBodyShipperId = async function () {
    let records = null;
    try {
      const args = {};
      records = await ApiService.getShippers(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.shipperId, record.name]);
  }
  
  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.code}
              value={body.code}
              onChange={(value) => updateBody('code', value)}
              validated={validated}
              maxLength={80}
              required={true}
              focus
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <NumericBox
              label={words.totalCargos}
              value={body.totalCargos}
              onChange={(value) => updateBody('totalCargos', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.shipper}
              value={body.shipperId}
              onChange={(value) => updateBody('shipperId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameBodyShipperId()}
              loader={loaderBodyShipperId}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <MoneyBox
              label={words.cost}
              value={body.cost}
              onChange={(value) => updateBody('cost', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.departureDate}
              value={body.departureDate}
              onChange={(value) => updateBody('departureDate', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.arrivalDate}
              value={body.arrivalDate}
              onChange={(value) => updateBody('arrivalDate', value)}
              validated={validated}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default ContractLeft2Action1;
