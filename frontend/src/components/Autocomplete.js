// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const Autocomplete = identity(function ({
  label,
  placeholder,
  value,
  baseFriendlyName,
  onChange,
  validated,
  required,
  searcher,
  disabled,
  focus,
  inline,
  onOk,
  onCancel
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);
  const [friendlyName, setFriendlyName] = React.useState(baseFriendlyName);
  const [searchValue, setSearchValue] = React.useState(null);
  const [freezeValue, setFreezeValue] = React.useState(null);
  const [dataSource, setDataSource] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(null);

  const refInput = React.useRef(null);

  React.useEffect(() => {
    if (focus) {
      refInput.current.focus();
    }
  }, []);

  const resetSearch = function () {
    setSearchValue(null);
    setDataSource(null);
    setCurrentIndex(null);
  }

  const handleKeyDown = function (e) {
    if (e.key === 'ArrowUp') {
      setCurrentIndex(function (prevCurrentIndex) {
        if (dataSource && dataSource.length > 0) {
          if (prevCurrentIndex !== null && prevCurrentIndex !== undefined) {
            if (prevCurrentIndex > 0) {
              return prevCurrentIndex - 1;
            }
            else {
              return prevCurrentIndex;
            }
          }
          else {
            return null;
          }
        }
        return null;
      });
    }
    else if (e.key === 'ArrowDown') {
      setCurrentIndex(function (prevCurrentIndex) {
        if (dataSource && dataSource.length > 0) {
          if (prevCurrentIndex !== null && prevCurrentIndex !== undefined) {
            if (prevCurrentIndex < (dataSource.length - 1)) {
              return prevCurrentIndex + 1;
            }
            else {
              return prevCurrentIndex;
            }
          }
          else {
            return 0;
          }
        }
        return null;
      });
    }
    else if (e.key === 'Enter') {
      if (dataSource && (currentIndex !== null && currentIndex !== undefined)) {
        const dataSourceItem = dataSource[currentIndex];
        onChange(dataSourceItem[0]);
        setFriendlyName(dataSourceItem[1]);
        resetSearch();
      }
      else if (onOk && errors.length === 0) {
        onOk();
      }
    }
    else if (e.key === 'Escape') {
      if (dataSource) {
        resetSearch();
      }
      else if (onCancel) {
        onCancel();
      }
    }
  }

  const handleOnChange = function (e) {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      onChange(null);
      setFriendlyName(null);
    }
  }

  const handleOnBlur = function (e) {
    resetSearch();
    if (onCancel) {
      onCancel();
    }
  }

  const handleClickItem = function (e, index) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const dataSourceItem = dataSource[index];
    onChange(dataSourceItem[0]);
    setFriendlyName(dataSourceItem[1]);
    resetSearch();
  }

  const debounce = function (fn, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  const fetchDataSource = React.useCallback(debounce(async function (freezeValue) {
    setFreezeValue(freezeValue);
    if (freezeValue === null || freezeValue === undefined || freezeValue.trim() === '') {
      setDataSource(null);
      setCurrentIndex(null);
      return;
    }
    setDataSource(await searcher(freezeValue));
    setCurrentIndex(null);
  }, 300), []);

  React.useEffect(() => {
    fetchDataSource(searchValue);
  }, [searchValue, fetchDataSource]);

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
        <input ref={refInput} className={'form-control' + (inline ? '-inline' : '') + (validated && errors.length > 0 ? ' is-invalid' : '')} type="text" placeholder={placeholder} value={searchValue !== null && searchValue !== undefined ? searchValue : (friendlyName !== null && friendlyName !== undefined ? friendlyName : '')} disabled={disabled} onKeyDown={handleKeyDown} onChange={handleOnChange} onFocus={(e) => e.target.select()} onBlur={handleOnBlur} />
        {validated && errors.map((error, index) => (
          <div key={'error-' + index} className={'form-error' + (inline ? '-inline' : '')}>{error}</div>
        ))}
      </div>
      {dataSource &&
        <ReactBootstrap.Overlay show={true} target={refInput.current} placement={getDropdownPlacement()}>
          <div className="dropdown-list" style={{ zIndex: 100000 }}>
            {dataSource.map(function (dataSourceItem, index) {
              const text = dataSourceItem[1];
              const textIndex = text ? text.toLowerCase().indexOf(freezeValue.toLowerCase()) : -1;
              if (textIndex === -1) {
                return (
                  <button key={'item-' + index} className={currentIndex === index ? 'current ' : ''} onMouseDown={(e) => e.preventDefault()} onClick={(e) => handleClickItem(e, index)}>
                    {text}
                  </button>
                );
              }
              return (
                <button key={'item-' + index} className={currentIndex === index ? 'current ' : ''} onMouseDown={(e) => e.preventDefault()} onClick={(e) => handleClickItem(e, index)}>
                  <span>{text.substring(0, textIndex)}</span>
                  <span className="fw-bold">{text.substring(textIndex, textIndex + freezeValue.length)}</span>
                  <span>{text.substring(textIndex + freezeValue.length)}</span>
                </button>
              );
            })}
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
});

export default Autocomplete;