import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import StepProgressBar from '../../components/StepProgressBar.js';
import { getWords } from '../../utils/get-words.js';

const CargoLeft1 = ReactRouterDOM.withRouter(function ({ cargo }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <StepProgressBar
        value={cargo.status}
        dataSource={[['inPreparation', words.inPreparation], ['dispatched', words.dispatched], ['delivered', words.delivered]]}
        colors={{ inPreparation: 'gray', dispatched: 'gold', delivered: 'green' }}
      />
    </div>
  );
})

export default CargoLeft1;
