// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const AppContext = React.createContext();

const useAppContext = function () {
  return React.useContext(AppContext);
}

const AppContextProvider = identity(function ({ defaultI18n, children }) {
  const [i18n, setI18n] = React.useState(defaultI18n);
  const [error, setError] = React.useState(null);

  return (
    <AppContext.Provider value={{ i18n, setI18n, error, setError }}>
      {children}
    </AppContext.Provider>
  );
});

export { useAppContext, AppContextProvider };
