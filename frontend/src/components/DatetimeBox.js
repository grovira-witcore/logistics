// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../contexts/AppContext.js';
import DatePicker from './DatePicker.js';
import TimePicker from './TimePicker.js';
import { identity } from '../utils/identity.js';
import { formatDatetime } from '../utils/format.js';

const DatetimeBox = identity(function ({
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
      const valueParts = e.target.value.split(' ');
      if (valueParts.length === 3) {
        const valuePart1 = valueParts[0];
        const valuePart2 = valueParts[1];
        const valuePart3 = valueParts[2];
        const datetimeParts = {};
        switch (i18n.dateFormat) {
          case 'dd/mm/yyyy': {
            const valuePart1Parts = valuePart1.split('/');
            if (valuePart1Parts.length === 3) {
              datetimeParts.day = parseInt(valuePart1Parts[0]);
              datetimeParts.month = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
          case 'mm/dd/yyyy': {
            const valuePart1Parts = valuePart1.split('/');
            if (valuePart1Parts.length === 3) {
              datetimeParts.month = parseInt(valuePart1Parts[0]);
              datetimeParts.day = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
          case 'dd.mm.yyyy': {
            const valuePart1Parts = valuePart1.split('.');
            if (valuePart1Parts.length === 3) {
              datetimeParts.day = parseInt(valuePart1Parts[0]);
              datetimeParts.month = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
          case 'mm.dd.yyyy': {
            const valuePart1Parts = valuePart1.split('.');
            if (valuePart1Parts.length === 3) {
              datetimeParts.month = parseInt(valuePart1Parts[0]);
              datetimeParts.day = parseInt(valuePart1Parts[1]);
              datetimeParts.year = parseInt(valuePart1Parts[2]);
            }
            break;
          }
        }
        const valuePart2Parts = valuePart2.split(':');
        if (valuePart2Parts.length === 2) {
          datetimeParts.hour = parseInt(valuePart2Parts[0]);
          datetimeParts.minute = parseInt(valuePart2Parts[1]);
        }
        if (valuePart3.toUpperCase() === 'PM') {
          datetimeParts.hour += 12;
        }
        if (datetimeParts.year >= 1900 && datetimeParts.year <= 2900 && datetimeParts.month >= 1 && datetimeParts.month <= 12 && datetimeParts.day >= 1 && datetimeParts.day <= 31 && datetimeParts.hour >= 0 && datetimeParts.hour <= 23 && datetimeParts.minute >= 0 && datetimeParts.day <= 59) {
          newValue = new Date(datetimeParts.year, datetimeParts.month - 1, datetimeParts.day, datetimeParts.hour, datetimeParts.minute).toISOString();
        }
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
    let targetDate = null;
    if (value !== null && value !== undefined) {
      const newDate = new Date(newValue);
      targetDate = new Date(value);
      targetDate.setFullYear(newDate.getFullYear());
      targetDate.setMonth(newDate.getMonth());
      targetDate.setDate(newDate.getDate());
    }
    else {
      targetDate = new Date(newValue);
    }
    setTextValue(null);
    onChange(targetDate.toISOString());
    setShowDropdown(false);
  }
  
  const handleTimePickerChange = function (newValue) {
    let targetDate = null;
    if (value !== null && value !== undefined) {
      const newDate = new Date(newValue);
      targetDate = new Date(value);
      targetDate.setHours(newDate.getHours());
      targetDate.setMinutes(newDate.getMinutes());
    }
    else {
      targetDate = new Date(newValue);
    }
    setTextValue(null);
    onChange(targetDate.toISOString());
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
    errors.push(i18n.requiredField);
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
        <input ref={refInput} className={'form-control' + (inline ? '-inline' : '') + (validated && errors.length > 0 ? ' is-invalid' : '')} type="text" placeholder={placeholder} value={textValue ?? (value !== null && value !== undefined ? formatDatetime(value, i18n.dateFormat) : '')} disabled={disabled} onClick={() => setShowDropdown(true)} onKeyDown={handleKeyDown} onChange={handleOnChange} onFocus={(e) => e.target.select()} onBlur={handleOnBlur} />
        {validated && errors.map((error, index) => (
          <div key={'error-' + index} className={'form-error' + (inline ? '-inline' : '')}>{error}</div>
        ))}
      </div>
      {showDropdown &&
        <ReactBootstrap.Overlay show={true} target={refInput.current} placement={getDropdownPlacement()}>
          <div className="tooltip d-flex" style={{ zIndex: 100000 }}>
            <DatePicker value={value} onChange={handleDatePickerChange} />
            <TimePicker value={value} onChange={handleTimePickerChange} />
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
});

export default DatetimeBox;