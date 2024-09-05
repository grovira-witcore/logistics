// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../context/AppContext.js';
import { getWords } from '../utils/get-words.js';

const OptionGroup = function ({
  label,
  value,
  onChange,
  validated,
  dataSource,
  required,
  focus
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);
  const [uniqueName, setUniqueName] = React.useState(null);

  const refInput = React.useRef(null);

  if (focus) {
    React.useEffect(() => {
      refInput.current.focus();
    }, []);
  }

  React.useEffect(() => {
    setUniqueName('unique_' + Math.random().toString(36).substring(2, 15));
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
          <div>
            <input key={dataSourceItem[0]} ref={i === 0 ? refInput : null} type="radio" name={uniqueName} value={dataSourceItem[0]} checked={value === dataSourceItem[0]} onChange={(e) => onChange(e.target.value)} />
            <span className="ps-2">{dataSourceItem[1]}</span>
          </div>
        ))}
      </div>
      {validated && errors.map((error, index) => (
        <div key={index} className="form-error">{error}</div>
      ))}
    </div>
  );
}

export default OptionGroup;
