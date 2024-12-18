import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import MoneyBox from '../../components/MoneyBox.js';
import { getWords } from '../../utils/get-words.js';

const CargoTopAction3 = ReactRouterDOM.withRouter(function ({ cargo, data, updateData, validated }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <MoneyBox
              label={words.additionalCostFull}
              value={data.additionalCost}
              onChange={(value) => updateData('additionalCost', value)}
              validated={validated}
              required={true}
              focus
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default CargoTopAction3;
