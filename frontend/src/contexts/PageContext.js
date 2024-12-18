// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const PageContext = React.createContext();

const usePageContext = function () {
  return React.useContext(PageContext);
}

const PageContextProvider = identity(function ({ children }) {
  const [refreshIndex, setRefreshIndex] = React.useState(0);
  const [keyValues, setKeyValues] = React.useState({});

  const refresh = function () {
    setRefreshIndex(prevRefreshIndex => prevRefreshIndex + 1);
  }

  const getPageValue = function (key) {
    return keyValues[key];
  }

  const setPageValue = function (key, value) {
    setKeyValues(prevKeyValues => ({ ...prevKeyValues, [key]: value }));
  }

  return (
    <PageContext.Provider value={{ refresh, getPageValue, setPageValue }}>
      <div key={refreshIndex}>
        {children}
      </div>
    </PageContext.Provider>
  );
});

export { usePageContext, PageContextProvider };
