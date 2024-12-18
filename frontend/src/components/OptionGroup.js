// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const OptionGroup = identity(function ({
  label,
  value,
  onChange,
  validated,
  dataSource,
  required,
  disabled,
  focus
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);
  const [uniqueName, setUniqueName] = React.useState(null);

  const refInput = React.useRef(null);

  React.useEffect(() => {
    if (focus) {
      refInput.current.focus();
    }
  }, []);

  React.useEffect(() => {
    const crypto = window.crypto || window.msCrypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    setUniqueName('unique_' + array[0]);
  }, []);

  const errors = [];
  if (required && (value === null || value === undefined)) {
    errors.push(words.requiredField);
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
      <div className="d-flex align-items-center gap-3">
        {dataSource.map((dataSourceItem, i) => (
          <div key={dataSourceItem[0]}>
            <input ref={i === 0 ? refInput : null} type="radio" name={uniqueName} value={dataSourceItem[0]} checked={value === dataSourceItem[0]} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
            <span className="ps-2">{dataSourceItem[1]}</span>
          </div>
        ))}
      </div>
      {validated && errors.map((error, index) => (
        <div key={'error-' + index} className="form-error">{error}</div>
      ))}
    </div>
  );
});

export default OptionGroup;
