import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import Brief from '../../components/Brief.js';
import IconDetails from '../../components/icons/IconDetails.js';
import { getWords } from '../../utils/get-words.js';

const BookingRight1 = ReactRouterDOM.withRouter(function ({ booking }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconDetails} label={words.details} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
        </div>
      </div>
      <Brief
        fieldsDisposition="table"
        fields={[
          {
            label: words.departureDate,
            type: 'date',
            value: booking.departureDate,
          },
          {
            label: words.arrivalDate,
            type: 'date',
            value: booking.arrivalDate,
          },
          {
            label: words.cost,
            type: 'money',
            value: booking.cost,
          },
        ]}
      />
    </div>
  );
})

export default BookingRight1;
