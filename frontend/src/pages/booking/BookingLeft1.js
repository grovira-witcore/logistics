import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import Brief from '../../components/Brief.js';
import IconQuantity from '../../components/icons/IconQuantity.js';
import IconShipper from '../../components/icons/IconShipper.js';
import IconTransporter from '../../components/icons/IconTransporter.js';
import IconTarget from '../../components/icons/IconTarget.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';

const BookingLeft1 = ReactRouterDOM.withRouter(function ({ booking }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconQuantity} label={words.quantities} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
        </div>
      </div>
      <Brief
        fieldsDisposition="spaces-between"
        fieldsSize="large"
        fields={[
          {
            icon: IconShipper,
            label: words.quantityDelivered,
            paragraph: {
              template: words.kgs,
              fields: [
                {
                  type: 'integer',
                  value: booking.kgDelivered,
                },
              ]
            },
            color: 'green',
          },
          {
            icon: IconTransporter,
            label: words.quantityDispatched,
            paragraph: {
              template: words.kgs,
              fields: [
                {
                  type: 'integer',
                  value: protect(function ([kgDispatched, kgDelivered]) { return kgDispatched - kgDelivered; }, [ booking.kgDispatched, booking.kgDelivered ]),
                },
              ]
            },
            color: 'yellow',
          },
          {
            icon: IconTarget,
            label: words.quantityAwaiting,
            paragraph: {
              template: words.kgs,
              fields: [
                {
                  type: 'integer',
                  value: protect(function ([kgTarget, kgDispatched]) { return kgTarget - kgDispatched; }, [ booking.kgTarget, booking.kgDispatched ]),
                },
              ]
            },
            color: 'gray',
          },
        ]}
      />
    </div>
  );
})

export default BookingLeft1;
