import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Brief from '../../components/Brief.js';
import IconDate from '../../components/icons/IconDate.js';
import IconContract from '../../components/icons/IconContract.js';
import IconCustomer from '../../components/icons/IconCustomer.js';
import IconQuantity from '../../components/icons/IconQuantity.js';
import { getWords } from '../../utils/get-words.js';

const ContractCostsBodyPart1 = ReactRouterDOM.withRouter(function ({ contract }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <Brief
        fieldsDisposition="spaces-between"
        fieldsSize="large"
        fields={[
          {
            icon: IconDate,
            label: words.date,
            type: 'date',
            color: function (value) { return 'blue'; },
            value: contract.date,
          },
          {
            icon: IconContract,
            label: words.contract,
            type: 'string',
            color: function (value) { return 'blue'; },
            value: contract.code,
          },
          {
            icon: IconCustomer,
            label: words.customer,
            type: 'string',
            color: function (value) { return 'blue'; },
            value: contract.customerName,
          },
          {
            icon: IconQuantity,
            label: words.quantity,
            color: function (value) { return 'blue'; },
            paragraph: {
              template: words.tons,
              fields: [
                {
                  type: 'integer',
                  value: contract.tons,
                },
              ]
            },
          },
        ]}
      />
    </div>
  );
})

export default ContractCostsBodyPart1;
