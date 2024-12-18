// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import DatePicker from './DatePicker.js';
import TimePicker from './TimePicker.js';
import { identity } from '../utils/identity.js';
import { formatDatetime } from '../utils/format.js';
import { getWords } from '../utils/get-words.js';

const FilterDatetimeRange = identity(function ({ filterValue, setFilterValue, trySubmit }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const [textFrom, setTextFrom] = React.useState(null);
  const [textTo, setTextTo] = React.useState(null);

  const inputFromRef = React.useRef(null);

  React.useEffect(() => {
    inputFromRef.current.focus({ preventScroll: true });
  }, []);

  const handleChange = function (e, fromOrTo) {
    if (fromOrTo === 'from') {
      setTextFrom(e.target.value);
    }
    else {
      setTextTo(e.target.value);
    }
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
    if (fromOrTo === 'from') {
      setFilterValue(prevFilterValue => prevFilterValue ? [newValue, prevFilterValue[1]] : [newValue, null]);
    }
    else {
      setFilterValue(prevFilterValue => prevFilterValue ? [prevFilterValue[0], newValue] : [null, newValue]);
    }
  }
  const handleBlur = function (e, fromOrTo) {
    if (fromOrTo === 'from') {
      setTextFrom(null);
    }
    else {
      setTextTo(null);
    }
  }
  const handleDatePickerChange = function (newValue, fromOrTo) {
    let value = null;
    if (filterValue) {
      if (fromOrTo === 'from') {
        value = filterValue[0];
      }
      else {
        value = filterValue[1];
      }
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
    if (fromOrTo === 'from') {
      setTextFrom(null);
      setFilterValue(prevFilterValue => prevFilterValue ? [targetDate.toISOString(), prevFilterValue[1]] : [targetDate.toISOString(), null]);
    }
    else {
      setTextTo(null);
      setFilterValue(prevFilterValue => prevFilterValue ? [prevFilterValue[0], targetDate.toISOString()] : [null, targetDate.toISOString()]);
    }
  }
  const handleTimePickerChange = function (newValue, fromOrTo) {
    let value = null;
    if (filterValue) {
      if (fromOrTo === 'from') {
        value = filterValue[0];
      }
      else {
        value = filterValue[1];
      }
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
    if (fromOrTo === 'from') {
      setTextFrom(null);
      setFilterValue(prevFilterValue => prevFilterValue ? [targetDate.toISOString(), prevFilterValue[1]] : [targetDate.toISOString(), null]);
    }
    else {
      setTextTo(null);
      setFilterValue(prevFilterValue => prevFilterValue ? [prevFilterValue[0], targetDate.toISOString()] : [null, targetDate.toISOString()]);
    }
  }
  const handleKeyPress = function (e) {
    if (e.key === 'Enter') {
      trySubmit();
    }
  }

  return (
    <div className="wit-filter-box-base wit-filter-box-range d-flex">
      <div>
        <input ref={inputFromRef} className="form-control" type="text" placeholder={words.from} value={textFrom ?? (filterValue ? (filterValue[0] !== null && filterValue[0] !== undefined ? formatDatetime(filterValue[0], i18n.dateFormat) : '') : null)} onChange={(e) => handleChange(e, 'from')} onBlur={(e) => handleBlur(e, 'from')} onKeyPress={handleKeyPress} />
        <div className="wit-filter-box-picker d-flex">
          <DatePicker value={filterValue ? filterValue[0] : null} onChange={(newValue) => handleDatePickerChange(newValue, 'from')} />
          <TimePicker value={filterValue ? filterValue[0] : null} onChange={(newValue) => handleTimePickerChange(newValue, 'from')} />
        </div>
      </div>
      <div>
        <input className="form-control" type="text" placeholder={words.to} value={textTo ?? (filterValue ? (filterValue[1] !== null && filterValue[1] !== undefined ? formatDatetime(filterValue[1], i18n.dateFormat) : '') : null)} onChange={(e) => handleChange(e, 'to')} onBlur={(e) => handleBlur(e, 'to')} onKeyPress={handleKeyPress} />
        <div className="wit-filter-box-picker d-flex">
          <DatePicker value={filterValue ? filterValue[1] : null} onChange={(newValue) => handleDatePickerChange(newValue, 'to')} />
          <TimePicker value={filterValue ? filterValue[1] : null} onChange={(newValue) => handleTimePickerChange(newValue, 'to')} />
        </div>
      </div>
    </div>
  );
});

export default FilterDatetimeRange;