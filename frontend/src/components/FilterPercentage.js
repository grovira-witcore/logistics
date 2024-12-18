// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const FilterPercentage = identity(function ({ filterValue, setFilterValue, trySubmit, decimalPlaces }) {
  const [textValue, setTextValue] = React.useState(null);

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus({ preventScroll: true });
  }, []);

  const handleChange = function (e, fromOrTo) {
    let cleanValue = e.target.value;
    if (cleanValue) {
      cleanValue = e.target.value.replace(/[^\d.\-]/g, '');
      if (cleanValue.length > 20) {
        cleanValue = cleanValue.substring(0, 20);
      }
    }
    setTextValue(cleanValue);
    let newValue = null;
    if (cleanValue !== null && cleanValue !== undefined && cleanValue !== '') {
      newValue = parseFloat(cleanValue) / 100;
      if (isNaN(newValue)) {
        newValue = null;
      }
      if (newValue) {
        if (newValue > 0) {
          if (decimalPlaces) {
            newValue = Math.floor(newValue * (10 ** (decimalPlaces + 2))) / (10 ** (decimalPlaces + 2));
          }
          else {
            newValue = Math.floor(newValue * (10 ** 2)) / (10 ** 2);
          }
        }
        else {
          if (decimalPlaces) {
            newValue = Math.ceil(newValue * (10 ** (decimalPlaces + 2))) / (10 ** (decimalPlaces + 2));
          }
          else {
            newValue = Math.ceil(newValue * (10 ** 2)) / (10 ** 2);
          }
        }
      }
    }
    setFilterValue(newValue);
  }
  const handleBlur = function (e, fromOrTo) {
    setTextValue(null);
  }
  const handleKeyPress = function (e) {
    if (e.key === 'Enter') {
      trySubmit();
    }
  }

  const numberToString = function (number) {
    if (number !== null && number !== undefined) {
      if (decimalPlaces) {
        return (number * 100).toFixed(decimalPlaces) + ' %';
      }
      else {
        return (number * 100).toString() + ' %';
      }
    }
    else {
      return '';
    }
  }

  return (
    <div className="wit-filter-box-base wit-filter-box-item-sm">
      <input ref={inputRef} className="form-control text-end" type="text" value={textFrom ?? (filterValue ? numberToString(filterValue) : null)} onChange={handleChange} onBlur={handleBlur} onKeyPress={handleKeyPress} />
    </div>
  );
});

export default FilterPercentage;