// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const NumericBox = identity(function ({
  label, 
  placeholder,
  value, 
  onChange, 
  validated,
  required,
  decimalPlaces,
  minValue,
  maxValue,
  disabled,
  focus,
  inline,
  onOk,
  onCancel
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const [textValue, setTextValue] = React.useState(null);

  const refInput = React.useRef(null);

  React.useEffect(() => {
    if (focus) {
      refInput.current.focus();
    }
  }, []);

  const handleKeyDown = function (e) {
    if (e.key === 'Enter') {
      if (onOk && errors.length === 0) {
        onOk();
      }
    }
    else if (e.key === 'Escape') {
      if (onCancel) {
        onCancel();
      }
    }
  }

  const handleOnChange = function (e) {
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
    onChange(newValue);
  }

  const handleOnBlur = function (e) {
    setTextValue(null);
    if (onCancel) {
      onCancel();
    }
  }

  const numberToString = function (number) {
    if (number !== null && number !== undefined) {
      if (decimalPlaces) {
        return number.toFixed(decimalPlaces);
      }
      else {
        return number.toString();
      }
    }
    else {
      return '';
    }
  }

  const errors = [];
  if (required && (value === null || value === undefined)) {
    errors.push(words.requiredField);
  }
  else if (value !== null && value !== undefined) {
    if (minValue !== null && minValue !== undefined && minValue > value) {
      errors.push(words.minValueAllowed + ': ' + numberToString(minValue));
    }
    if (maxValue !== null && maxValue !== undefined && maxValue < value) {
      errors.push(words.maxValueAllowed + ': ' + numberToString(maxValue));
    }
  }

  return (
    <div className={'form-group' + (inline ? '-inline' : '')} data-invalid={errors.length > 0 ? '1' : null}>
      {label ?
        <div className={'form-label' + (inline ? '-inline' : '') + ' d-flex align-items-center'}>
          <div>{label}</div>
          {required && (<div className="text-red">*</div>)}
        </div> :
        null
      }
      <input ref={refInput} className={'form-control' + (inline ? '-inline' : '') + (validated && errors.length > 0 ? ' is-invalid' : '')} type="text" placeholder={placeholder} value={textValue ?? numberToString(value)} disabled={disabled} onKeyDown={handleKeyDown} onChange={handleOnChange} onFocus={(e) => e.target.select()} onBlur={handleOnBlur} />
      {validated && errors.map((error, index) => (
        <div key={'error-' + index} className={'form-error' + (inline ? '-inline' : '')}>{error}</div>
      ))}
    </div>
  );
});

export default NumericBox;