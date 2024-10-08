// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../context/AppContext.js';
import { getWords } from '../utils/get-words.js';

const TextBox = function ({
  label,
  placeholder,
  value,
  onChange,
  validated,
  required,
  maxLength,
  regex,
  regexText,
  focus,
  inline,
  onOk,
  onCancel
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const refInput = React.useRef(null);

  if (focus) {
    React.useEffect(() => {
      refInput.current.focus();
    }, []);
  }

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
      if (maxLength !== null && maxLength !== undefined && cleanValue.length > maxLength) {
        cleanValue = cleanValue.substring(0, maxLength);
      }
    }
    let newValue = null;
    if (cleanValue !== null && cleanValue !== undefined && cleanValue !== '') {
      newValue = cleanValue;
    }
    onChange(newValue);
  }

  const handleOnBlur = function (e) {
    if (onCancel) {
      onCancel();
    }
  }

  const errors = [];
  if (required && (value === null || value === undefined)) {
    errors.push(words.requiredField);
  }
  else if (value !== null && value !== undefined) {
    if (regex && !regex.test(value)) {
      errors.push(regexText);
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
      <input ref={refInput} className={'form-control' + (inline ? '-inline' : '') + (validated && errors.length > 0 ? ' is-invalid' : '')} type="text" placeholder={placeholder} value={value !== null && value !== undefined ? value : ''} onKeyDown={handleKeyDown} onChange={handleOnChange} onFocus={(e) => e.target.select()} onBlur={handleOnBlur} />
      {validated && errors.map((error, index) => (
        <div key={'error-' + index} className={'form-error' + (inline ? '-inline' : '')}>{error}</div>
      ))}
    </div>
  );
}

export default TextBox;