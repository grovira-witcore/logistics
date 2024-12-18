import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
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
            value: contract.date,
            color: 'blue',
          },
          {
            icon: IconContract,
            label: words.contract,
            type: 'string',
            value: contract.code,
            color: 'blue',
          },
          {
            icon: IconCustomer,
            label: words.customer,
            type: 'string',
            value: contract.customerName,
            color: 'blue',
          },
          {
            icon: IconQuantity,
            label: words.quantity,
            paragraph: {
              template: words.tons,
              fields: [
                {
                  type: 'integer',
                  value: contract.tons,
                },
              ]
            },
            color: 'blue',
          },
        ]}
      />
    </div>
  );
})

export default ContractCostsBodyPart1;
