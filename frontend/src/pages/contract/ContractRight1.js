import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import Brief from '../../components/Brief.js';
import IconDetails from '../../components/icons/IconDetails.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';

const ContractRight1 = ReactRouterDOM.withRouter(function ({ contract }) {
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
            label: words.baseCostFull,
            type: 'money',
            value: contract.baseCost,
          },
          {
            label: words.additionalCostFull,
            type: 'money',
            value: contract.additionalCost,
          },
          {
            label: words.totalCostFull,
            type: 'money',
            value: protect(function ([baseCost, additionalCost]) { return baseCost + additionalCost; }, [ contract.baseCost, contract.additionalCost ]),
          },
        ]}
      />
    </div>
  );
})

export default ContractRight1;
