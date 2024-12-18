// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import DatePicker from './DatePicker.js';
import { identity } from '../utils/identity.js';
import { formatDate } from '../utils/format.js';
import { getWords } from '../utils/get-words.js';

const FilterDateRange = identity(function ({ filterValue, setFilterValue, trySubmit }) {
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
      const dateParts = {};
      switch (i18n.dateFormat) {
        case 'dd/mm/yyyy': {
          const valueParts = e.target.value.split('/');
          if (valueParts.length === 3) {
            dateParts.day = parseInt(valueParts[0]);
            dateParts.month = parseInt(valueParts[1]);
            dateParts.year = parseInt(valueParts[2]);
          }
          break;
        }
        case 'mm/dd/yyyy': {
          const valueParts = e.target.value.split('/');
          if (valueParts.length === 3) {
            dateParts.month = parseInt(valueParts[0]);
            dateParts.day = parseInt(valueParts[1]);
            dateParts.year = parseInt(valueParts[2]);
          }
          break;
        }
        case 'dd.mm.yyyy': {
          const valueParts = e.target.value.split('.');
          if (valueParts.length === 3) {
            dateParts.day = parseInt(valueParts[0]);
            dateParts.month = parseInt(valueParts[1]);
            dateParts.year = parseInt(valueParts[2]);
          }
          break;
        }
        case 'mm.dd.yyyy': {
          const valueParts = e.target.value.split('.');
          if (valueParts.length === 3) {
            dateParts.month = parseInt(valueParts[0]);
            dateParts.day = parseInt(valueParts[1]);
            dateParts.year = parseInt(valueParts[2]);
          }
          break;
        }
      }
      if (dateParts.year >= 1900 && dateParts.year <= 2900 && dateParts.month >= 1 && dateParts.month <= 12 && dateParts.day >= 1 && dateParts.day <= 31) {
        newValue = new Date(dateParts.year, dateParts.month - 1, dateParts.day).toISOString();
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
    if (fromOrTo === 'from') {
      setTextFrom(null);
      setFilterValue(prevFilterValue => prevFilterValue ? [newValue, prevFilterValue[1]] : [newValue, null]);
    }
    else {
      setTextTo(null);
      setFilterValue(prevFilterValue => prevFilterValue ? [prevFilterValue[0], newValue] : [null, newValue]);
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
        <input ref={inputFromRef} className="form-control" type="text" placeholder={words.from} value={textFrom ?? (filterValue ? (filterValue[0] !== null && filterValue[0] !== undefined ? formatDate(filterValue[0], i18n.dateFormat) : '') : null)} onChange={(e) => handleChange(e, 'from')} onBlur={(e) => handleBlur(e, 'from')} onKeyPress={handleKeyPress} />
        <div className="wit-filter-box-picker">
          <DatePicker value={filterValue ? filterValue[0] : null} onChange={(newValue) => handleDatePickerChange(newValue, 'from')} />
        </div>
      </div>
      <div>
        <input className="form-control" type="text" placeholder={words.to} value={textTo ?? (filterValue ? (filterValue[1] !== null && filterValue[1] !== undefined ? formatDate(filterValue[1], i18n.dateFormat) : '') : null)} onChange={(e) => handleChange(e, 'to')} onBlur={(e) => handleBlur(e, 'to')} onKeyPress={handleKeyPress} />
        <div className="wit-filter-box-picker">
          <DatePicker value={filterValue ? filterValue[1] : null} onChange={(newValue) => handleDatePickerChange(newValue, 'to')} />
        </div>
      </div>
    </div>
  );
});

export default FilterDateRange;