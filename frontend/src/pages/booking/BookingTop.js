import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Title from '../../components/Title.js';
import Paragraph from '../../components/Paragraph.js';
import Brief from '../../components/Brief.js';
import IconBooking from '../../components/icons/IconBooking.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';

const BookingTop = ReactRouterDOM.withRouter(function ({ booking }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const history = ReactRouterDOM.useHistory();

  const handleClickField1 = function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    history.push('/contract/' + booking.contractId);
  }
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconBooking} label={booking.code} secondaryLabel={<Paragraph template={words.bookingProcess} fields={[]} />} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
        </div>
      </div>
      <Brief
        fieldsDisposition="spaces-between"
        fields={[
          {
            label: words.customer,
            type: 'string',
            value: booking.contractCustomerName,
          },
          {
            label: words.contract,
            type: 'string',
            value: booking.contractCode,
            onClick: handleClickField1,
          },
          {
            label: words.shipper,
            type: 'string',
            value: booking.shipperName,
          },
          {
            label: words.totalCargos,
            type: 'integer',
            value: booking.totalCargos,
          },
          {
            label: words.status,
            type: 'string',
            translate: true,
            variant: 'frame',
            color: function (value) { return value === 'inProgress' ? 'yellow' : (value === 'completed' ? 'green' : null); },
            value: booking.status,
          },
          {
            label: words.progress,
            paragraph: {
              template: words.progressBarTemplate,
              fields: [
                {
                  type: 'percentage',
                  value: protect(function ([kgDispatched, kgTarget]) { return kgDispatched / kgTarget }, [ booking.kgDispatched, booking.kgTarget ]),
                },
                {
                  type: 'percentage',
                  value: protect(function ([kgDelivered, kgTarget]) { return kgDelivered / kgTarget }, [ booking.kgDelivered, booking.kgTarget ]),
                },
              ]
            },
          },
        ]}
      />
    </div>
  );
})

export default BookingTop;
