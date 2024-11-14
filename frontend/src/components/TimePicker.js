// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const TimePicker = identity(function ({ value, onChange }) {

  const handleHourMinute = function (hour, minute) {
    if (value !== null && value !== undefined) {
      const targetDate = new Date(value);
      targetDate.setHours(hour);
      targetDate.setMinutes(minute);
      onChange(targetDate.toISOString());
    }
  }

  let currentHour = null;
  let currentMinute = null;
  if (value !== null && value !== undefined) {
    const currentDate = new Date(value);
    currentHour = currentDate.getHours();
    currentMinute = currentDate.getMinutes();
  }
  return (
    <div className="wit-time-picker" style={{ overflow: 'auto' }}>
      {['AM', 'PM'].map((texti, i) =>
        ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map((textj, j) =>
          ['00', '30'].map(function (textk, k) {
            const hour = i * 12 + j;
            const minute = k * 30;
            return (<button key={hour + ':' + minute} className={'wit-time-picker-hour' + (currentHour === hour && currentMinute === minute ? ' wit-time-picker-hour-selected' : '')} onMouseDown={(e) => e.preventDefault()} onClick={(e) => handleHourMinute(hour, minute)}>{textj + ':' + textk + ' ' + texti}</button>)
          })
        )
      )}
    </div>
  );
});

export default TimePicker;