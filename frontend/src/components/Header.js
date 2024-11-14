// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';
import Menu from './Menu.js';
import Omnisearch from './Omnisearch.js';
import HeaderLanguage from './HeaderLanguage.js';
import HeaderUser from './HeaderUser.js';

const Header = ReactRouterDOM.withRouter(function ({ icon, label, searcher, languages, menu }) {
  const { setError } = useAppContext();

  const history = ReactRouterDOM.useHistory();

  const handleClickHome = function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setError(null);
    history.push('/');
  }

  return (
    <div className="wit-header d-flex align-items-center justify-content-between">
      <div className="col-4 gap-1 d-flex align-items-center justify-content-start">
        <Menu menu={menu} />
        <button className="wit-header-title d-flex align-items-center cursor-pointer" onClick={handleClickHome}>
          <div>{React.createElement(icon)}</div>
          <div>{label}</div>
        </button>
      </div>
      {searcher ?
        <div className="col-4 d-flex align-items-center justify-content-around">
          <Omnisearch searcher={searcher} />
        </div> :
        null
      }
      <div className="col-4 gap-3 d-flex align-items-center justify-content-end">
        {languages.length > 1 ?
          <HeaderLanguage languages={languages} /> :
          null
        }
        <HeaderUser />
      </div>
    </div>
  );
})

export default Header;