// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const StepProgressBar = identity(function ({ value, dataSource, colors, stepsGroups }) {
  return (
    <div className="wit-step-progress-bar">
      {dataSource.map(function (dataSourceItem, index) {
        if (index < (dataSource.length - 1) && stepsGroups && stepsGroups.some(stepGroup => stepGroup[0] === dataSourceItem[0] && stepGroup[1] === dataSource[index + 1][0])) {
          return (
            <div key={'step-' + index} className="wit-step-progress-bar-item">
              <div className={'wit-step-progress-bar-node-' + (dataSourceItem[0] === value || dataSource[index + 1][0] === value ? (colors && colors[value] ? colors[value] : 'primary') : 'disabled')}>{index + 1}</div>
              {dataSourceItem[0] === value || dataSource[index + 1][0] === value ?
                <div className={'wit-step-progress-bar-text-enabled'}>{dataSourceItem[0] === value ? dataSourceItem[1] : dataSource[index + 1][1]}</div> :
                <div className={'wit-step-progress-bar-text-disabled'}>{dataSourceItem[1] + ' / ' + dataSource[index + 1][1]}</div>
              }
            </div>
          );
        }
        else if (index > 0 && stepsGroups && stepsGroups.some(stepGroup => stepGroup[0] === dataSource[index - 1][0] && stepGroup[1] === dataSourceItem[0])) {
          return null;
        }
        else {
          return (
            <div key={'step-' + index} className="wit-step-progress-bar-item">
              <div className={'wit-step-progress-bar-node-' + (dataSourceItem[0] === value ? (colors && colors[value] ? colors[value] : 'primary') : 'disabled')}>{index + 1}</div>
              <div className={'wit-step-progress-bar-text-' + (dataSourceItem[0] === value ? 'enabled' : 'disabled')}>{dataSourceItem[1]}</div>
            </div>
          )
        }
      })}
    </div>
  );
});

export default StepProgressBar;
