// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { format } from '../utils/format.js';

const FieldProgressBar = function ({ value, color }) {
  return (
    <div>
      <div className="progress bg-disabled" style={{ width: '160px' }}>
        <div className={'progress-bar bg-' + (color ?? 'primary')} role="progressbar" style={{ width: Math.floor(value * 100) + '%' }} />
      </div>
      <div className="pt-1">
        {format(value, 'percentage', {})}
      </div>
    </div>
  );
};

export default FieldProgressBar;