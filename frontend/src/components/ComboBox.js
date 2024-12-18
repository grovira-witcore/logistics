// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const ComboBox = identity(function ({
  label,
  placeholder,
  value,
  baseFriendlyName,
  onChange,
  validated,
  required,
  dataSource,
  loader,
  disabled,
  focus,
  inline,
  onOk,
  onCancel
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const solveFriendlyName = function () {
    if (baseFriendlyName) {
      return baseFriendlyName;
    }
    if (dataSource && (value !== null && value !== undefined)) {
      const dataSourceItem = dataSource.find(dataSourceItemX => dataSourceItemX[0] === value || (dataSourceItemX[0] === true && value === 1) || (dataSourceItemX[0] === false && value === 0));
      if (dataSourceItem) {
        return dataSourceItem[1];
      }
    }
    return null;
  }

  const [friendlyName, setFriendlyName] = React.useState(solveFriendlyName());
  const [currentDataSource, setCurrentDataSource] = React.useState(dataSource);
  const [show, setShow] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(null);

  const refInput = React.useRef(null);

  React.useEffect(() => {
    if (focus) {
      refInput.current.focus();
    }
  }, []);

  React.useEffect(() => {
    if (currentIndex !== null && currentIndex !== undefined) {
      const comboBoxDd = document.getElementById('comboBoxDd');
      const comboBoxDdItem = comboBoxDd.querySelector('button');
      if (comboBoxDdItem) {
        const absolutePosition = currentIndex * comboBoxDdItem.clientHeight;
        const availableHeight = 230 - comboBoxDdItem.clientHeight;
        if (absolutePosition < comboBoxDd.scrollTop || absolutePosition > (comboBoxDd.scrollTop + availableHeight)) {
          if (absolutePosition < availableHeight) {
            comboBoxDd.scrollTop = 0;
          }
          else {
            comboBoxDd.scrollTop = absolutePosition - availableHeight;
          }
        }
      }
    }
  }, [currentIndex])

  const resetSearch = function () {
    setShow(false);
    setCurrentIndex(null);
  }

  const handleClick = async function (e) {
    let loadedDataSource = currentDataSource;
    if (loadedDataSource === null || loadedDataSource === undefined) {
      loadedDataSource = await loader();
      setCurrentDataSource(loadedDataSource);
    }
    setShow(true);
  }

  const handleKeyDown = async function (e) {
    let loadedDataSource = currentDataSource;
    if (e.key === 'ArrowDown' || /^[a-zA-Z]$/.test(e.key) || /^\d$/.test(e.key)) {
      if (loadedDataSource === null || loadedDataSource === undefined) {
        loadedDataSource = await loader();
        setCurrentDataSource(loadedDataSource);
      }
      setShow(true);
    }
    if (e.key === 'ArrowUp') {
      setCurrentIndex(function (prevCurrentIndex) {
        if (loadedDataSource && loadedDataSource.length > 0) {
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
        if (loadedDataSource && loadedDataSource.length > 0) {
          if (prevCurrentIndex !== null && prevCurrentIndex !== undefined) {
            if (prevCurrentIndex < (loadedDataSource.length - 1)) {
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
    else if (/^[a-zA-Z]$/.test(e.key) || /^\d$/.test(e.key)) {
      setCurrentIndex(function (prevCurrentIndex) {
        if (loadedDataSource && loadedDataSource.length > 0) {
          if (prevCurrentIndex !== null && prevCurrentIndex !== undefined) {
            for (let i = prevCurrentIndex + 1; i < loadedDataSource.length; i++) {
              const dataSourceItem = loadedDataSource[i];
              if (dataSourceItem[1] && dataSourceItem[1].toLowerCase().startsWith(e.key.toLowerCase())) {
                return i;
              }
            }
          }
          for (let i = 0; i < loadedDataSource.length; i++) {
            const dataSourceItem = loadedDataSource[i];
            if (dataSourceItem[1] && dataSourceItem[1].toLowerCase().startsWith(e.key.toLowerCase())) {
              return i;
            }
          }
          return null;
        }
        return null;
      });
    }
    else if (e.key === 'Backspace') {
      onChange(null);
      setFriendlyName(null);
      resetSearch();
    }
    else if (e.key === 'Enter') {
      if (currentDataSource && show && (currentIndex !== null && currentIndex !== undefined)) {
        const dataSourceItem = currentDataSource[currentIndex];
        onChange(dataSourceItem[0]);
        setFriendlyName(dataSourceItem[1]);
        resetSearch();
      }
      else if (onOk && errors.length === 0) {
        onOk();
      }
    }
    else if (e.key === 'Escape') {
      if (currentDataSource && show) {
        resetSearch();
      }
      else if (onCancel) {
        onCancel();
      }
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
    const dataSourceItem = currentDataSource[index];
    onChange(dataSourceItem[0]);
    setFriendlyName(dataSourceItem[1]);
    resetSearch();
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
    <div>
      <div className={'form-group' + (inline ? '-inline' : '')} data-invalid={errors.length > 0 ? '1' : null}>
        {label ?
          <div className={'form-label' + (inline ? '-inline' : '') + ' d-flex align-items-center'}>
            <div>{label}</div>
            {required && (<div className="text-red">*</div>)}
          </div> :
          null
        }
        <input ref={refInput} className={'form-control' + (inline ? '-inline' : '') + (validated && errors.length > 0 ? ' is-invalid' : '')} type="text" placeholder={placeholder} value={friendlyName !== null && friendlyName !== undefined ? friendlyName : ''} disabled={disabled} onClick={handleClick} onKeyDown={handleKeyDown} onFocus={(e) => e.target.select()} onBlur={handleOnBlur} />
        {validated && errors.map((error, index) => (
          <div key={'error-' + index} className={'form-error' + (inline ? '-inline' : '')}>{error}</div>
        ))}
      </div>
      {currentDataSource && show &&
        <ReactBootstrap.Overlay show={true} target={refInput.current} placement={getDropdownPlacement()}>
          <div id="comboBoxDd" className="dropdown-list" style={{ overflowX: 'auto', maxHeight: 230, zIndex: 100000 }}>
            {currentDataSource.map(function (dataSourceItem, index) {
              return (
                <button key={'item-' + index} className={currentIndex === index ? 'current' : ''} onMouseDown={(e) => e.preventDefault()} onClick={(e) => handleClickItem(e, index)}>
                  {dataSourceItem[1]}
                </button>
              );
            })}
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
});

export default ComboBox;
