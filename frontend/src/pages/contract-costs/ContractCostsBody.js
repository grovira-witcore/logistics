import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import IconCost from '../../components/icons/IconCost.js';
import ContractCostsBodyPart1 from './ContractCostsBodyPart1.js';
import ContractCostsBodyPart2 from './ContractCostsBodyPart2.js';
import { getWords } from '../../utils/get-words.js';

const ContractCostsBody = ReactRouterDOM.withRouter(function ({ contract }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconCost} label={words.costBreakdown} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
        </div>
      </div>
      <div>
        {contract ?
          <div className="pb-2">
            <ContractCostsBodyPart1 contract={contract} />
          </div> :
          null
        }
        {contract ?
          <div className="pb-2">
            <ContractCostsBodyPart2 contract={contract} />
          </div> :
          null
        }
      </div>
    </div>
  );
})

export default ContractCostsBody;
