import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import TextBox from '../../components/TextBox.js';
import NumericBox from '../../components/NumericBox.js';
import ComboBox from '../../components/ComboBox.js';
import MoneyBox from '../../components/MoneyBox.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';

const BookingLeft2Action1 = ReactRouterDOM.withRouter(function ({ booking, body, updateBody, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  const getBaseFriendlyNameBodyTransporterId = function () {
    return null;
  }
  
  const loaderBodyTransporterId = async function () {
    let records = null;
    try {
      const args = {};
      records = await ApiService.getTransporters(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.transporterId, record.name]);
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
        </div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <NumericBox
              label={words.pallets}
              value={body.pallets}
              onChange={(value) => updateBody('pallets', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <NumericBox
              label={words.grossLb}
              value={body.grossLb}
              onChange={(value) => updateBody('grossLb', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.transporter}
              value={body.transporterId}
              onChange={(value) => updateBody('transporterId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameBodyTransporterId()}
              loader={loaderBodyTransporterId}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <MoneyBox
              label={words.baseCost}
              value={body.baseCost}
              onChange={(value) => updateBody('baseCost', value)}
              validated={validated}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default BookingLeft2Action1;
