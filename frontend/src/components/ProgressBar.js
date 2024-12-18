// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';
import { format } from '../utils/format.js';
import { protect } from '../utils/protect.js';

const ProgressBar = identity(function ({ fields }) {
  const renderBar = function (fields, index) {
    const field = fields[index];
    if (index === 0) {
      return (
        <div className={'progress-bar bg-' + (protect(field.color, field.value) ?? 'primary')} style={{ width: Math.floor(field.value * 160) + 'px', height: '100px' }} />
      );
    }
    else {
      let sum = 0;
      for (let i = 0; i <= index; i++) {
        sum += fields[i].value;
      }
      return (
        <div className={'progress-bar bg-' + (protect(field.color, field.value) ?? 'primary')} style={{ width: Math.floor(sum * 160) + 'px', height: '100px' }}>
          {renderBar(fields, index - 1)}
        </div>
      );
    }
  }

  return (
    <div>
      <div className="progress bg-disabled" style={{ width: '160px' }}>
        {renderBar(fields, fields.length - 1)}
      </div>
      <div className="pt-1 d-flex">
        {fields
          .map((field, i) => (
            <div key={'field-' + i} className="d-flex">
              {i > 0 ? (<div className="px-2 fw-bold">{'/'}</div>) : null}
              <div className={'text-' + (protect(field.color, field.value) ?? 'primary')}>{format(field.value, 'percentage', {})}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
});

export default ProgressBar;
