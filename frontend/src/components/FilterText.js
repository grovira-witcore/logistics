// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const FilterText = identity(function ({ filterValue, setFilterValue, trySubmit }) {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus({ preventScroll: true });
  }, []);  

  const handleChange = function (e) {
    setFilterValue(e.target.value);
  }
  const handleKeyPress = function (e) {
    if (e.key === 'Enter') {
      trySubmit();
    }
  }

  return (
    <div className="wit-filter-box-base wit-filter-box-item-lg">
      <input ref={inputRef} className="form-control" type="text" value={filterValue} onChange={handleChange} onKeyPress={handleKeyPress} />
    </div>
  );
});

export default FilterText;