import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactRouterDOM from 'react-router-dom';
import './styles/main.scss';
import { AppContextProvider } from './contexts/AppContext.js';
import SecurityService from './services/SecurityService.js';
import App from './App.js';
import { getDefaultI18n } from './utils/get-default-i18n.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const defaultI18n = getDefaultI18n();

SecurityService.init(root, defaultI18n, function () {
  return (
    <ReactRouterDOM.BrowserRouter>
      <AppContextProvider defaultI18n={defaultI18n}>
        <App/>
      </AppContextProvider>
    </ReactRouterDOM.BrowserRouter>
  );
});
