import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Brief from '../../components/Brief.js';
import { getWords } from '../../utils/get-words.js';

const CargoLeft2Part1 = ReactRouterDOM.withRouter(function ({ cargo }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <Brief
        fieldsDisposition="table"
        fields={[
          {
            label: words.tareLb,
            type: 'integer',
            value: cargo.tareLb,
          },
          {
            label: words.tareKg,
            type: 'integer',
            value: cargo.tareKg,
          },
          {
            label: words.grossLb,
            type: 'integer',
            value: cargo.grossLb,
          },
          {
            label: words.grossKg,
            type: 'integer',
            value: cargo.grossKg,
          },
          {
            label: words.netLb,
            type: 'integer',
            value: cargo.netLb,
          },
          {
            label: words.netKg,
            type: 'integer',
            value: cargo.netKg,
          },
        ]}
      />
    </div>
  );
})

export default CargoLeft2Part1;
