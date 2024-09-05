import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Title from '../../components/Title.js';
import Paragraph from '../../components/Paragraph.js';
import ActionsBar from '../../components/ActionsBar.js';
import Brief from '../../components/Brief.js';
import IconContract from '../../components/icons/IconContract.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';

const ContractTop = ReactRouterDOM.withRouter(function ({ contract }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const history = ReactRouterDOM.useHistory();

  const handleAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    history.push('/contract-costs/' + contract.contractId);
  }
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconContract} label={contract.code} secondaryLabel={<Paragraph template={words.contractTemplate} fields={[]} />} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
          <ActionsBar
            actions={[
              { label: words.costBreakdown, color: 'primary', onClick: handleAction0 },
            ]}
          />
        </div>
      </div>
      <Brief
        fieldsDisposition="spaces-between"
        fields={[
          {
            label: words.date,
            type: 'date',
            value: contract.date,
          },
          {
            label: words.customer,
            type: 'string',
            value: contract.customerName,
          },
          {
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
          },
          {
            label: words.deadline,
            type: 'date',
            color: function (value) { const deadline = new Date(value); const now = new Date(); return deadline < now ? 'red' : null; },
            style: function (value) { const deadline = new Date(value); const now = new Date(); const timeDiff = deadline - now; const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); return daysDiff <= 0 || daysDiff < 6 ? 'fw-bold' : ''; },
            value: contract.deadline,
            secondaryField: {
              type: 'string',
              value: protect(function ([deadline]) { const today = new Date(); const deadlineDate = new Date(deadline); const differenceInTime = deadlineDate - today; const daysLeft = Math.floor(differenceInTime / (1000 * 3600 * 24));  return daysLeft > 0 ? `${daysLeft} day(s) left` : ''; }, [ contract.deadline ]),
            },
          },
          {
            label: words.status,
            type: 'string',
            translate: true,
            variant: 'frame',
            color: function (value) { return value === 'completed' ? 'green' : (value === 'inProgress' ? 'yellow' : null); },
            value: contract.status,
          },
          {
            label: words.progress,
            paragraph: {
              template: words.progressBarTemplate,
              fields: [
                {
                  type: 'percentage',
                  value: protect(function ([kgDispatched, kgTarget]) { return kgDispatched / kgTarget }, [ contract.kgDispatched, contract.kgTarget ]),
                },
                {
                  type: 'percentage',
                  value: protect(function ([kgDelivered, kgTarget]) { return kgDelivered / kgTarget }, [ contract.kgDelivered, contract.kgTarget ]),
                },
              ]
            },
          },
        ]}
      />
    </div>
  );
})

export default ContractTop;
