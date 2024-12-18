import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import DateBox from '../../components/DateBox.js';
import TextBox from '../../components/TextBox.js';
import { getWords } from '../../utils/get-words.js';

const BookingLeft2ContextualAction2 = ReactRouterDOM.withRouter(function ({ cargo, data, updateData, validated }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <DateBox
              label={words.deliveredDate}
              value={data.deliveredDate}
              onChange={(value) => updateData('deliveredDate', value)}
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
              value={data.containerCode}
              onChange={(value) => updateData('containerCode', value)}
              validated={validated}
              maxLength={80}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.containerSeal}
              value={data.containerSeal}
              onChange={(value) => updateData('containerSeal', value)}
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

export default BookingLeft2ContextualAction2;
