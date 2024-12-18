// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../contexts/AppContext.js';
import FilterText from './FilterText.js';
import FilterNumeric from './FilterNumeric.js';
import FilterNumericRange from './FilterNumericRange.js';
import FilterMoney from './FilterMoney.js';
import FilterMoneyRange from './FilterMoneyRange.js';
import FilterPercentage from './FilterPercentage.js';
import FilterPercentageRange from './FilterPercentageRange.js';
import FilterDate from './FilterDate.js';
import FilterDateRange from './FilterDateRange.js';
import FilterDatetime from './FilterDatetime.js';
import FilterDatetimeRange from './FilterDatetimeRange.js';
import FilterOption from './FilterOption.js';
import IconOk from './icons/IconOk.js';
import IconCancel from './icons/IconCancel.js';
import IconDelete from './icons/IconDelete.js';
import IconMenuCollapsed from './icons/IconMenuCollapsed.js';
import { identity } from '../utils/identity.js';
import { format, formatNumber, formatDate, formatDatetime } from '../utils/format.js';
import { getWords } from '../utils/get-words.js';

const FiltersBar = identity(function ({ sessionStorageKey, filters, filtersValues, setFiltersValues }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const [asyncDataSources, setAsyncDataSources] = React.useState(new Array(filters.length));
  const [currentFilterIndex, setCurrentFilterIndex] = React.useState(null);
  const [currentFilterValue, setCurrentFilterValue] = React.useState(null);
  const filterBarRef = React.useRef(null);
  
  React.useEffect(() => {
    if (sessionStorageKey) {
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(filtersValues));
    }
  }, [filtersValues]);

  let currentFilter = null;
  let currentAsyncDataSource = null;
  if (currentFilterIndex !== null && currentFilterIndex !== undefined) {
    currentFilter = filters[currentFilterIndex];
    currentAsyncDataSource = asyncDataSources[currentFilterIndex];
  }
  else {
    currentFilter = null;
  }

  const overlay = {};
  if (currentFilter !== null && currentFilter !== undefined) {
    const findOverlayTarget = function (element, value) {
      if (element.dataset['filter'] === value) {
        return element;
      }
      for (const childElement of element.children) {
        const foundElement = findOverlayTarget(childElement, value);
        if (foundElement) {
          return foundElement;
        }
      }
      return null;
    }
    overlay.target = findOverlayTarget(filterBarRef.current, 'filter-' + currentFilterIndex);
    if (overlay.target) {
      const rect = overlay.target.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const distanceToBottom = screenHeight - rect.bottom;
      if (distanceToBottom < 260) {
        overlay.placement = 'top-start';
      }
      else {
        overlay.placement = 'bottom-start';
      }
    }
  }

  const handleStartFilterEdition = async function (e, index) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const filter = filters[index];
    if (filter.variant === 'option' && filter.loader) {
      const asyncDataSource = asyncDataSources[index];
      if (asyncDataSource === null || asyncDataSource === undefined) {
        const newAsyncDataSource = await filter.loader();
        setAsyncDataSources((prevAsyncDataSources) => {
          const newAsyncDataSources = [...prevAsyncDataSources];
          newAsyncDataSources[index] = newAsyncDataSource;
          return newAsyncDataSources;
        });
      }
    }
    setCurrentFilterIndex(index);
    setCurrentFilterValue(filtersValues[index]);
  }
  const handleSubmitFilterEdition = function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const newFiltersValues = [];
    for (let index = 0; index < filters.length; index++) {
      if (index === currentFilterIndex) {
        newFiltersValues.push(currentFilterValue);
      }
      else {
        newFiltersValues.push(index < filtersValues.length ? filtersValues[index] : null);
      }
    }
    setFiltersValues(newFiltersValues);
    setCurrentFilterIndex(null);
    setCurrentFilterValue(null);
  }
  const handleCancelFilterEdition = function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setCurrentFilterIndex(null);
    setCurrentFilterValue(null);
  }
  const handleDeleteFilterValue = function (e, filterIndex) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setFiltersValues(filtersValues.map((filterValue, index) => {
      if (index === filterIndex) {
        return null;
      }
      else {
        return filterValue;
      }
    }));
    setCurrentFilterIndex(null);
    setCurrentFilterValue(null);
    e.stopPropagation();
  }
  const isValidCurrentFilter = function () {
    if (
      currentFilterValue === null ||
      currentFilterValue === undefined ||
      currentFilterValue === '' ||
      (Array.isArray(currentFilterValue) && !currentFilterValue.some((item) => item !== null && item !== undefined))
    ) {
      return false;
    }
    if (
      (currentFilter.variant === 'numeric-range' || currentFilter.variant === 'money-range' || currentFilter.variant === 'percentage-range' || currentFilter.variant === 'date-range' || currentFilter.variant === 'datetime-range') &&
      (!Array.isArray(currentFilterValue) || currentFilterValue.length !== 2 || (currentFilterValue[0] !== null && currentFilterValue[0] !== undefined && currentFilterValue[1] !== null && currentFilterValue[1] !== undefined && currentFilterValue[0] > currentFilterValue[1]))
    ) {
      return false;
    }
    return true;
  }
  const convertFilterValueToText = function (filter, filterIndex, filterValue) {
    switch (filter.variant) {
      case 'text': {
        return '"' + filterValue + '"';
      }
      case 'numeric': {
        return formatNumber(filterValue, filter.decimalPlaces);
      }
      case 'numeric-range': {
        let textParts = [];
        if (filterValue[0] !== null && filterValue[0] !== undefined) {
          textParts.push(words.from + ' ' + formatNumber(filterValue[0], filter.decimalPlaces));
        }
        if (filterValue[1] !== null && filterValue[1] !== undefined) {
          textParts.push(words.to + ' ' + formatNumber(filterValue[1], filter.decimalPlaces));
        }
        return textParts.join(' ');
      }
      case 'money': {
        return format(filterValue, 'money', { moneySymbol: i18n.moneySymbol });
      }
      case 'money-range': {
        let textParts = [];
        if (filterValue[0] !== null && filterValue[0] !== undefined) {
          textParts.push(words.from + ' ' + format(filterValue[0], 'money', { moneySymbol: i18n.moneySymbol }));
        }
        if (filterValue[1] !== null && filterValue[1] !== undefined) {
          textParts.push(words.to + ' ' + format(filterValue[1], 'money', { moneySymbol: i18n.moneySymbol }));
        }
        return textParts.join(' ');
      }
      case 'percentage': {
        return format(filterValue, 'percentage', {});
      }
      case 'percentage-range': {
        let textParts = [];
        if (filterValue[0] !== null && filterValue[0] !== undefined) {
          textParts.push(words.from + ' ' + format(filterValue[0], 'percentage', {}));
        }
        if (filterValue[1] !== null && filterValue[1] !== undefined) {
          textParts.push(words.to + ' ' + format(filterValue[1], 'percentage', {}));
        }
        return textParts.join(' ');
      }
      case 'date': {
        return formatDate(filterValue, i18n.dateFormat);
      }
      case 'date-range': {
        let textParts = [];
        if (filterValue[0] !== null && filterValue[0] !== undefined) {
          textParts.push(words.from + ' ' + formatDate(filterValue[0], i18n.dateFormat));
        }
        if (filterValue[1] !== null && filterValue[1] !== undefined) {
          textParts.push(words.to + ' ' + formatDate(filterValue[1], i18n.dateFormat));
        }
        return textParts.join(' ');
      }
      case 'datetime': {
        return formatDatetime(filterValue, i18n.dateFormat);
      }
      case 'datetime-range': {
        let textParts = [];
        if (filterValue[0] !== null && filterValue[0] !== undefined) {
          textParts.push(words.from + ' ' + formatDatetime(filterValue[0], i18n.dateFormat));
        }
        if (filterValue[1] !== null && filterValue[1] !== undefined) {
          textParts.push(words.to + ' ' + formatDatetime(filterValue[1], i18n.dateFormat));
        }
        return textParts.join(' ');
      }
      case 'option': {
        const textParts = [];
        for (const item of filterValue) {
          let dataSourceToUse = filter.dataSource;
          if (dataSourceToUse === null || dataSourceToUse === undefined) {
            dataSourceToUse = asyncDataSources[filterIndex];
          }
          const dataSourceItem = dataSourceToUse.find((dataSourceItem) => dataSourceItem[0] === item);
          if (dataSourceItem) {
            textParts.push(dataSourceItem[1]);
          }
        }
        return textParts.join(', ');
      }
      default: {
        return '';
      }
    }
  }

  return (
    <div>
      <div ref={filterBarRef} className="wit-filters-bar d-flex align-items-center flex-wrap">
        {filters.map(function (filter, filterIndex) {
          const filterValue = filterIndex < filtersValues.length ? filtersValues[filterIndex] : null;
          return (
            <div className="wit-filter-container d-flex align-items-center" key={'filter-' + filterIndex}>
              <button className="wit-filter d-flex align-items-center" data-filter={'filter-' + filterIndex} onClick={(e) => handleStartFilterEdition(e, filterIndex)}>
                <div className="wit-filter-label">{filter.label + ':'}</div>
                {filterValue ?
                  <div className="wit-filter-value">{convertFilterValueToText(filter, filterIndex, filterValue)}</div> :
                  <div className="wit-filter-all">{'< ' + words.all + ' >'}</div>
                }
                <div className="wit-filter-icon-arrow-down d-flex align-items-center">
                  <IconMenuCollapsed />
                </div>
              </button>
              {filterValue ?
                <button className="wit-filter-icon-delete d-flex align-items-center" onClick={(e) => handleDeleteFilterValue(e, filterIndex)}>
                  <IconDelete />
                </button> :
                null
              }
            </div>
          );
        })}
      </div>
      {overlay.target &&
        <ReactBootstrap.Overlay show={true} target={overlay.target} placement={overlay.placement} rootClose={true} onHide={handleCancelFilterEdition}>
          <div className="wit-filter-box" style={{ zIndex: 100000 }}>
            {currentFilter.variant === 'text' && (
              <FilterText filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} />
            )}
            {currentFilter.variant === 'numeric' && (
              <FilterNumeric filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} decimalPlaces={currentFilter.decimalPlaces} />
            )}
            {currentFilter.variant === 'numeric-range' && (
              <FilterNumericRange filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} decimalPlaces={currentFilter.decimalPlaces} />
            )}
            {currentFilter.variant === 'money' && (
              <FilterMoney filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} decimalPlaces={currentFilter.decimalPlaces} />
            )}
            {currentFilter.variant === 'money-range' && (
              <FilterMoneyRange filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} decimalPlaces={currentFilter.decimalPlaces} />
            )}
            {currentFilter.variant === 'percentage' && (
              <FilterPercentage filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} />
            )}
            {currentFilter.variant === 'percentage-range' && (
              <FilterPercentageRange filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} />
            )}
            {currentFilter.variant === 'date' && (
              <FilterDate filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} />
            )}
            {currentFilter.variant === 'date-range' && (
              <FilterDateRange filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} />
            )}
            {currentFilter.variant === 'datetime' && (
              <FilterDatetime filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} />
            )}
            {currentFilter.variant === 'datetime-range' && (
              <FilterDatetimeRange filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} />
            )}
            {currentFilter.variant === 'option' && (
              <FilterOption filterValue={currentFilterValue} setFilterValue={setCurrentFilterValue} trySubmit={() => isValidCurrentFilter() && handleSubmitFilterEdition({})} dataSource={currentFilter.dataSource ?? currentAsyncDataSource} exclusive={currentFilter.exclusive} />
            )}
            <div className="wit-filter-box-bottom d-flex justify-content-end">
              {isValidCurrentFilter() ?
                <button className="wit-filter-box-ok-button" onClick={handleSubmitFilterEdition}>
                  <IconOk/>
                </button> :
                <div className="wit-filter-box-ok-button-disabled">
                  <IconOk/>
                </div>
              }
              <button className="wit-filter-box-cancel-button" onClick={handleCancelFilterEdition}>
                <IconCancel/>
              </button>
            </div>
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
});

export default FiltersBar;