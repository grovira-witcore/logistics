import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import TextBox from '../../components/TextBox.js';
import { getWords } from '../../utils/get-words.js';

const CustomersBodyContextualAction1 = ReactRouterDOM.withRouter(function ({ customer, data, updateData, validated }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.name}
              value={data.name}
              onChange={(value) => updateData('name', value)}
              validated={validated}
              maxLength={80}
              required={true}
              focus
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.phoneNumber}
              value={data.phoneNumber}
              onChange={(value) => updateData('phoneNumber', value)}
              validated={validated}
              maxLength={15}
              required={true}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
            <TextBox
              label={words.email}
              value={data.email}
              onChange={(value) => updateData('email', value)}
              validated={validated}
              maxLength={100}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default CustomersBodyContextualAction1;
