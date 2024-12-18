// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const TextArea = identity(function ({
  label,
  placeholder,
  value,
  onChange,
  validated,
  required,
  maxLength,
  regex,
  regexText,
  disabled,
  focus
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const refTextarea = React.useRef(null);

  React.useEffect(() => {
    if (focus) {
      refTextarea.current.focus();
    }
  }, []);

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
    <div className="form-group" data-invalid={errors.length > 0 ? '1' : null}>
      {label ?
        <div className="form-label d-flex align-items-center">
          <div>{label}</div>
          {required && (<div className="text-red">*</div>)}
        </div> :
        null
      }
      <textarea ref={refTextarea} className={'form-control' + (validated && errors.length > 0 ? ' is-invalid' : '')} rows={4} placeholder={placeholder} value={value !== null && value !== undefined ? value : ''} disabled={disabled} onChange={handleOnChange} onFocus={(e) => e.target.select()} />
      {validated && errors.map((error, index) => (
        <div key={'error-' + index} className="form-error">{error}</div>
      ))}
    </div>
  );
});

export default TextArea;