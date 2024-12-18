// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../contexts/AppContext.js';
import DatePicker from './DatePicker.js';
import { identity } from '../utils/identity.js';
import { formatDate } from '../utils/format.js';
import { getWords } from '../utils/get-words.js';

const DateBox = identity(function ({ 
  label, 
  placeholder,
  value, 
  onChange, 
  validated,
  required,
  disabled,
  focus,
  inline,
  onOk,
  onCancel
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const [textValue, setTextValue] = React.useState(null);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const refInput = React.useRef(null);

  React.useEffect(() => {
    if (focus) {
      refInput.current.focus();
    }
  }, []);

  const handleKeyDown = function (e) {
    if (e.key === 'ArrowDown') {
      setShowDropdown(true);
    }
    else if (e.key === 'Enter') {
      if (onOk && errors.length === 0) {
        onOk();
      }
    }
    else if (e.key === 'Escape') {
      if (showDropdown) {
        setShowDropdown(false);
      }
      else if (onCancel) {
        onCancel();
      }
    }
  }

  const handleOnChange = function (e) {
    setTextValue(e.target.value);
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
    onChange(newValue);
  }

  const handleOnBlur = function (e) {
    setTextValue(null);
    setShowDropdown(false);
    if (onCancel) {
      onCancel();
    }
  }

  const handleDatePickerChange = function (newValue) {
    setTextValue(null);
    onChange(newValue);
    setShowDropdown(false);
  }

  const getDropdownPlacement = function () {
    if (refInput.current) {
      const rect = refInput.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const distanceToBottom = screenHeight - rect.bottom;
      if (distanceToBottom < 260) {
        return 'top-start';
      }
    }
    return 'bottom-start';
  };

  const errors = [];
  if (required && (value === null || value === undefined)) {
    errors.push(words.requiredField);
  }

  return (
    <div style={{ width: '100%' }}>
      <div className={'form-group' + (inline ? '-inline' : '')} data-invalid={errors.length > 0 ? '1' : null}>
        {label ?
          <div className={'form-label' + (inline ? '-inline' : '') + ' d-flex align-items-center'}>
            <div>{label}</div>
            {required && (<div className="text-red">*</div>)}
          </div> :
          null
        }
        <input ref={refInput} className={'form-control' + (inline ? '-inline' : '') + (validated && errors.length > 0 ? ' is-invalid' : '')} type="text" placeholder={placeholder} value={textValue ?? (value !== null && value !== undefined ? formatDate(value, i18n.dateFormat) : '')} disabled={disabled} onClick={() => setShowDropdown(true)} onKeyDown={handleKeyDown} onChange={handleOnChange} onFocus={(e) => e.target.select()} onBlur={handleOnBlur} />
        {validated && errors.map((error, index) => (
          <div key={'error-' + index} className={'form-error' + (inline ? '-inline' : '')}>{error}</div>
        ))}
      </div>
      {showDropdown &&
        <ReactBootstrap.Overlay show={true} target={refInput.current} placement={getDropdownPlacement()}>
          <div className="tooltip rounded" style={{ zIndex: 100000 }}>
            <DatePicker value={value} onChange={handleDatePickerChange} />
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
});

export default DateBox;