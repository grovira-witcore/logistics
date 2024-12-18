// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import DatePicker from './DatePicker.js';
import TimePicker from './TimePicker.js';
import { identity } from '../utils/identity.js';
import { formatDatetime } from '../utils/format.js';

const FilterDatetime = identity(function ({ filterValue, setFilterValue, trySubmit }) {
  const { i18n } = useAppContext();

  const [textValue, setTextValue] = React.useState(null);

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus({ preventScroll: true });
  }, []);

  const handleChange = function (e) {
    setTextValue(e.target.value);
    let newValue = null;
    if (e.target.value !== null && e.target.value !== undefined && e.target.value !== '') {
      const valueParts = e.target.value.split(' ');
      if (valueParts.length === 3) {
        const valuePart1 = valueParts[0];
        const valuePart2 = valueParts[1];
        const valuePart3 = valueParts[2];
        const datetimeParts = {};
        switch (i18n.dateFormat) {
          case 'dd/mm/yyyy': {
            const valuePart1Parts = valuePart1.split('/');
            if (valuePart1Parts.length === 3) {
              datetimeParts.day = parseInt(valuePart1Parts[0]);
              datetimeParts.month = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
          case 'mm/dd/yyyy': {
            const valuePart1Parts = valuePart1.split('/');
            if (valuePart1Parts.length === 3) {
              datetimeParts.month = parseInt(valuePart1Parts[0]);
              datetimeParts.day = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
          case 'dd.mm.yyyy': {
            const valuePart1Parts = valuePart1.split('.');
            if (valuePart1Parts.length === 3) {
              datetimeParts.day = parseInt(valuePart1Parts[0]);
              datetimeParts.month = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
          case 'mm.dd.yyyy': {
            const valuePart1Parts = valuePart1.split('.');
            if (valuePart1Parts.length === 3) {
              datetimeParts.month = parseInt(valuePart1Parts[0]);
              datetimeParts.day = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
        }
        const valuePart2Parts = valuePart2.split(':');
        if (valuePart2Parts.length === 2) {
          datetimeParts.hour = parseInt(valuePart2Parts[0]);
          datetimeParts.minute = parseInt(valuePart2Parts[1]);
        }
        if (valuePart3.toUpperCase() === 'PM') {
          datetimeParts.hour += 12;
        }
        if (datetimeParts.year >= 1900 && datetimeParts.year <= 2900 && datetimeParts.month >= 1 && datetimeParts.month <= 12 && datetimeParts.day >= 1 && datetimeParts.day <= 31 && datetimeParts.hour >= 0 && datetimeParts.hour <= 23 && datetimeParts.minute >= 0 && datetimeParts.day <= 59) {
          newValue = new Date(datetimeParts.year, datetimeParts.month - 1, datetimeParts.day, datetimeParts.hour, datetimeParts.minute).toISOString();
        }
      }
    }
    setFilterValue(newValue);
  }
  const handleBlur = function (e) {
    setTextValue(null);
  }
  const handleDatePickerChange = function (newValue) {
    let value = null;
    if (filterValue) {
      value = filterValue;
    }
    let targetDate = null;
    if (value !== null && value !== undefined) {
      const newDate = new Date(newValue);
      targetDate = new Date(value);
      targetDate.setFullYear(newDate.getFullYear());
      targetDate.setMonth(newDate.getMonth());
      targetDate.setDate(newDate.getDate());
    }
    else {
      targetDate = new Date(newValue);
    }
    setTextValue(null);
    setFilterValue(targetDate.toISOString());
  }
  const handleTimePickerChange = function (newValue, fromOrTo) {
    let value = null;
    if (filterValue) {
      value = filterValue;
    }
    let targetDate = null;
    if (value !== null && value !== undefined) {
      const newDate = new Date(newValue);
      targetDate = new Date(value);
      targetDate.setHours(newDate.getHours());
      targetDate.setMinutes(newDate.getMinutes());
    }
    else {
      targetDate = new Date(newValue);
    }
    setTextValue(null);
    setFilterValue(targetDate.toISOString());
  }
  const handleKeyPress = function (e) {
    if (e.key === 'Enter') {
      trySubmit();
    }
  }

  return (
    <div className="wit-filter-box-base">
      <input ref={inputRef} className="form-control" type="text" value={textValue ?? (filterValue ? formatDatetime(filterValue, i18n.dateFormat) : '')} onChange={handleChange} onBlur={handleBlur} onKeyPress={handleKeyPress} />
      <div className="wit-filter-box-picker d-flex">
        <DatePicker value={filterValue} onChange={(newValue) => handleDatePickerChange(newValue)} />
        <TimePicker value={filterValue} onChange={(newValue) => handleTimePickerChange(newValue)} />
      </div>
    </div>
  );
});

export default FilterDatetime;