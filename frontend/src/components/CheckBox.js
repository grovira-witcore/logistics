// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const CheckBox = identity(function ({
  label,
  value,
  onChange,
  validated,
  required,
  mandatory,
  mandatoryText,
  disabled,
  focus
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const refInput = React.useRef(null);

  React.useEffect(() => {
    if (focus) {
      refInput.current.focus();
    }
  }, []);

  const handleOnChange = function (e) {
    if (e.target.checked) {
      onChange(true);
    }
    else {
      onChange(false);
    }
  }

  const errors = [];
  if (required && (value === null || value === undefined)) {
    errors.push(words.requiredField);
  }
  else if (value !== null && value !== undefined) {
    if (mandatory && !value) {
      errors.push(mandatoryText);
    }
  }

  return (
    <div className="form-group" data-invalid={errors.length > 0 ? '1' : null}>
      <div className="form-label d-flex align-items-center">
        <input ref={refInput} type="checkbox" checked={value} disabled={disabled} onChange={handleOnChange} />
        {label ? <div>{label}</div> : null}
      </div>
      {validated && errors.map((error, index) => (
        <div key={'error-' + index} className="form-error">{error}</div>
      ))}
    </div>
  );
});

export default CheckBox;