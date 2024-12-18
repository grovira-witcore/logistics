import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Brief from '../../components/Brief.js';
import { getWords } from '../../utils/get-words.js';

const CargoLeft2Part2 = ReactRouterDOM.withRouter(function ({ cargo }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <Brief
        fieldsDisposition="table"
        fields={[
          {
            label: words.dispatchedDate,
            type: 'date',
            value: cargo.dispatchedDate,
          },
          {
            label: words.deliveredDate,
            type: 'date',
            value: cargo.deliveredDate,
          },
          {
            label: words.containerCode,
            type: 'string',
            value: cargo.containerCode,
          },
          {
            label: words.containerSeal,
            type: 'string',
            value: cargo.containerSeal,
          },
          {
            label: words.baseCostFull,
            type: 'money',
            value: cargo.baseCost,
          },
          {
            label: words.additionalCostFull,
            type: 'money',
            value: cargo.additionalCost,
          },
        ]}
      />
    </div>
  );
})

export default CargoLeft2Part2;
