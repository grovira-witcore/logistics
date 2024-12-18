import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import ComboBox from '../../components/ComboBox.js';
import TextArea from '../../components/TextArea.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';

const ContractRight2Action1 = ReactRouterDOM.withRouter(function ({ data, updateData, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  const getBaseFriendlyNameContractId = function () {
    return null;
  }
  
  const loaderContractId = async function () {
    let records = null;
    try {
      const args = {};
      records = await ApiService.getContracts(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.contractId, record.code]);
  }
  
  const getBaseFriendlyNameBookingId = function () {
    return null;
  }
  
  const loaderBookingId = async function () {
    let records = null;
    try {
      const args = {};
      records = await ApiService.getBookings(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.bookingId, record.code]);
  }
  
  const getBaseFriendlyNameCargoId = function () {
    return null;
  }
  
  const loaderCargoId = async function () {
    let records = null;
    try {
      const args = {};
      records = await ApiService.getCargos(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.cargoId, record.code]);
  }
  
  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.contract}
              value={data.contractId}
              onChange={(value) => updateData('contractId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameContractId()}
              loader={loaderContractId}
              required={true}
              focus
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.booking}
              value={data.bookingId}
              onChange={(value) => updateData('bookingId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameBookingId()}
              loader={loaderBookingId}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.cargo}
              value={data.cargoId}
              onChange={(value) => updateData('cargoId', value)}
              validated={validated}
              baseFriendlyName={getBaseFriendlyNameCargoId()}
              loader={loaderCargoId}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
            <TextArea
              label={words.url}
              value={data.url}
              onChange={(value) => updateData('url', value)}
              validated={validated}
              maxLength={255}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default ContractRight2Action1;
