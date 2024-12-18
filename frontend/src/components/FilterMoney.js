// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';

const FilterMoney = identity(function ({ filterValue, setFilterValue, trySubmit, decimalPlaces }) {
  const { i18n } = useAppContext();

  const [textValue, setTextValue] = React.useState(null);

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus({ preventScroll: true });
  }, []);

  const handleChange = function (e) {
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
      newValue = parseFloat(cleanValue);
      if (isNaN(newValue)) {
        newValue = null;
      }
      if (newValue) {
        if (newValue > 0) {
          if (decimalPlaces) {
            newValue = Math.floor(newValue * (10 ** decimalPlaces)) / (10 ** decimalPlaces);
          }
          else {
            newValue = Math.floor(newValue);
          }
        }
        else {
          if (decimalPlaces) {
            newValue = Math.ceil(newValue * (10 ** decimalPlaces)) / (10 ** decimalPlaces);
          }
          else {
            newValue = Math.ceil(newValue);
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
        return i18n.moneySymbol + ' ' + number.toFixed(decimalPlaces);
      }
      else {
        return i18n.moneySymbol + ' ' + number.toString();
      }
    }
    else {
      return '';
    }
  }

  return (
    <div className="wit-filter-box-base wit-filter-box-item-sm">
      <input ref={inputRef} className="form-control text-end" type="text" value={textValue ?? (filterValue ? numberToString(filterValue) : null)} onChange={handleChange} onBlur={handleBlur} onKeyPress={handleKeyPress} />
    </div>
  );
});

export default FilterMoney;