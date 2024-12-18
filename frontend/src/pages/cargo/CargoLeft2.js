import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import IconDetails from '../../components/icons/IconDetails.js';
import CargoLeft2Part1 from './CargoLeft2Part1.js';
import CargoLeft2Part2 from './CargoLeft2Part2.js';
import { getWords } from '../../utils/get-words.js';

const CargoLeft2 = ReactRouterDOM.withRouter(function ({ cargo }) {
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
      <div className="container">
        <div className="row">
          {cargo ?
            <div className="col wit-horizontal-area">
              <CargoLeft2Part1  cargo={cargo} />
            </div> :
            null
          }
          {cargo ?
            <div className="col wit-horizontal-area">
              <CargoLeft2Part2  cargo={cargo} />
            </div> :
            null
          }
        </div>
      </div>
    </div>
  );
})

export default CargoLeft2;
