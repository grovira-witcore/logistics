import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import TextBox from '../../components/TextBox.js';
import { getWords } from '../../utils/get-words.js';

const ShippersBodyContextualAction1 = ReactRouterDOM.withRouter(function ({ shipper, data, updateData, validated }) {
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
              maxLength={100}
              required={true}
              focus
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default ShippersBodyContextualAction1;