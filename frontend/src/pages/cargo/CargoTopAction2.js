import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import DateBox from '../../components/DateBox.js';
import TextBox from '../../components/TextBox.js';
import { getWords } from '../../utils/get-words.js';

const CargoTopAction2 = ReactRouterDOM.withRouter(function ({ cargo, body, updateBody, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.deliveredDate}
              value={body.deliveredDate}
              onChange={(value) => updateBody('deliveredDate', value)}
              validated={validated}
              required={true}
              focus
            />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.containerCode}
              value={body.containerCode}
              onChange={(value) => updateBody('containerCode', value)}
              validated={validated}
              maxLength={80}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.containerSeal}
              value={body.containerSeal}
              onChange={(value) => updateBody('containerSeal', value)}
              validated={validated}
              maxLength={80}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default CargoTopAction2;
