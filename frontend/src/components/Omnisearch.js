// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import IconSearch from './icons/IconSearch.js';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const Omnisearch = identity(function ({
  searcher
}) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const refInput = React.useRef(null);

  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  const history = ReactRouterDOM.useHistory();

  const clearAll = function () {
    setValue('');
    setResult(null);
    setSelected(null);
  }

  const handleKeyDown = function (e) {
    if (e.key === 'ArrowUp') {
      setSelected(function (prevSelected) {
        if (result && result.groups && result.groups.some(resultGroup => resultGroup.items.length > 0)) {
          const newSelected = {};
          if (prevSelected) {
            newSelected.indexGroup = prevSelected.indexGroup;
            newSelected.indexItem = prevSelected.indexItem - 1;
          }
          else {
            return null;
          }
          while (newSelected.indexItem < 0) {
            newSelected.indexGroup--;
            if (newSelected.indexGroup < 0) {
              return prevSelected;
            }
            newSelected.indexItem = result.groups[newSelected.indexGroup].items.length - 1;
          }
          return newSelected;
        }
        else {
          return null;
        }
      });
    }
    else if (e.key === 'ArrowDown') {
      setSelected(function (prevSelected) {
        if (result && result.groups && result.groups.some(resultGroup => resultGroup.items.length > 0)) {
          const newSelected = {};
          if (prevSelected) {
            newSelected.indexGroup = prevSelected.indexGroup;
            newSelected.indexItem = prevSelected.indexItem + 1;
          }
          else {
            newSelected.indexGroup = 0;
            newSelected.indexItem = 0;
          }
          while (newSelected.indexItem > (result.groups[newSelected.indexGroup].items.length - 1)) {
            newSelected.indexGroup++;
            if (newSelected.indexGroup > (result.groups.length - 1)) {
              return prevSelected;
            }
            newSelected.indexItem = 0;
          }
          return newSelected;
        }
        else {
          return null;
        }
      });
    }
    else if (e.key === 'Enter') {
      if (selected && result) {
        clearAll();
        history.push(result.groups[selected.indexGroup].items[selected.indexItem][0]);
      }
    }
    else if (e.key === 'Escape') {
      clearAll();
    }
  }

  const handleClickItem = function (e, path) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    clearAll();
    history.push(path);
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

  const fetchResult = React.useCallback(debounce(async function (freezeValue) {
    if (freezeValue.trim() === '') {
      setResult(null);
      setSelected(null);
      return;
    }
    const groups = await searcher(freezeValue);
    if (!groups.some(group => group.items.length > 0)) {
      setResult(null);
      setSelected(null);
      return;
    }
    setResult({ freezeValue: freezeValue, groups: groups });
    setSelected(null);
  }, 300), []);

  React.useEffect(() => {
    fetchResult(value);
  }, [value, fetchResult]);

  const solveLine = function (text, freezeValue) {
    const index = text.toLowerCase().indexOf(freezeValue.toLowerCase());
    if (index === -1) {
      return {
        element: <div>{text}</div>,
        match: false
      };
    }
    return {
      element: (
        <div>
          <span>{text.substring(0, index)}</span>
          <span className="fw-bold">{text.substring(index, index + freezeValue.length)}</span>
          <span>{text.substring(index + freezeValue.length)}</span>
        </div>
      ),
      match: true
    };
  }

  return (
    <div>
      <div ref={refInput} className="wit-omnisearch d-flex align-items-center">
        <input className="form-control" type="text" placeholder={words.search + '...'} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} onBlur={(e) => clearAll()} />
        <IconSearch />
      </div>
      {result &&
        <ReactBootstrap.Overlay show={true} target={refInput.current} placement="bottom-start">
          <div className="wit-omnisearch-dd" style={{ zIndex: 100000 }}>
            {result.groups.map(function (resultGroup, indexGroup) {
              if (resultGroup.items.length === 0) {
                return null;
              }
              return (
                <div key={'group-' + indexGroup} className="wit-omnisearch-dd-group">
                  <div className="wit-omnisearch-dd-group-label">
                    {words[resultGroup.labelKey]}
                  </div>
                  {resultGroup.items.map(function (resultItem, indexItem) {
                    const solvedLine1 = solveLine(resultItem[1], result.freezeValue);
                    let solvedLine2 = null;
                    if (!solvedLine1.match && resultItem.length > 2) {
                      for (let i = 2; i < resultItem.length; i++) {
                        if (solvedLine2 === null || solvedLine2 === undefined) {
                          solvedLine2 = solveLine(resultItem[i], result.freezeValue);
                          if (!solvedLine2.match) {
                            solvedLine2 = null;
                          }
                        }
                      }
                    }
                    return (
                      <button key={'item-' + indexItem} className={'wit-omnisearch-dd-item ' + (selected && selected.indexGroup === indexGroup && selected.indexItem === indexItem ? 'current ' : '') + 'd-flex align-items-center'} onMouseDown={(e) => e.preventDefault()} onClick={(e) => handleClickItem(e, resultItem[0])}>
                        {React.createElement(resultGroup.icon)}
                        <div>
                          <div>{solvedLine1.element}</div>
                          {solvedLine2 ?
                            <div>{solvedLine2.element}</div> :
                            null
                          }
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
});

export default Omnisearch;