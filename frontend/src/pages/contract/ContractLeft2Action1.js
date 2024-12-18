import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import TextBox from '../../components/TextBox.js';
import NumericBox from '../../components/NumericBox.js';
import ComboBox from '../../components/ComboBox.js';
import MoneyBox from '../../components/MoneyBox.js';
import DateBox from '../../components/DateBox.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';

const ContractLeft2Action1 = ReactRouterDOM.withRouter(function ({ contract, data, updateData, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  const getBaseFriendlyNameShipperId = function () {
    return null;
  }
  
  const loaderShipperId = async function () {
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
              value={data.code}
              onChange={(value) => updateData('code', value)}
              validated={validated}
              maxLength={80}
              required={true}
              focus
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <NumericBox
              label={words.totalCargos}
              value={data.totalCargos}
              onChange={(value) => updateData('totalCargos', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.shipper}
              value={data.shipperId}
              onChange={(value) => updateData('shipperId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameShipperId()}
              loader={loaderShipperId}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <MoneyBox
              label={words.cost}
              value={data.cost}
              onChange={(value) => updateData('cost', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.departureDate}
              value={data.departureDate}
              onChange={(value) => updateData('departureDate', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.arrivalDate}
              value={data.arrivalDate}
              onChange={(value) => updateData('arrivalDate', value)}
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
