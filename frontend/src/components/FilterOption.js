// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const FilterOption = identity(function ({ filterValue, setFilterValue, trySubmit, dataSource, exclusive }) {

  const handleCheckboxChange = function (e, item) {
    if (exclusive) {
      setFilterValue([item]);
    }
    else {
      if (filterValue && filterValue.includes(item)) {
        setFilterValue(prevFilterValue => prevFilterValue.filter(itemX => itemX !== item));
      }
      else {
        setFilterValue(prevFilterValue => prevFilterValue ? [...prevFilterValue, item] : [item]);
      }
    }
  }

  return (
    <div className="wit-filter-box-options">
      {(dataSource ?? []).map((dataSourceItem) =>
        <div key={dataSourceItem[0]} className="d-flex">
          <input type="checkbox" checked={filterValue && (filterValue === dataSourceItem[0] || (Array.isArray(filterValue) && filterValue.includes(dataSourceItem[0])))} onChange={(e) => handleCheckboxChange(e, dataSourceItem[0])} />
          <div>{dataSourceItem[1]}</div>
        </div>
      )}
    </div>
  );
});

export default FilterOption;