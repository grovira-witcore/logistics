// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext.js';
import Menu from './Menu.js';
import Omnisearch from './Omnisearch.js';
import HeaderLanguage from './HeaderLanguage.js';
import HeaderUser from './HeaderUser.js';
import IconArrowLeft from './icons/IconArrowLeft.js';
import IconSearch from './icons/IconSearch.js';

const Header = ReactRouterDOM.withRouter(function ({ icon, label, searcher, languages, menu }) {
  const { setError } = useAppContext();

  const [searchMode, setSearchMode] = React.useState(false);

  const history = ReactRouterDOM.useHistory();

  const handleClickHome = function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setError(null);
    history.push('/');
  }

  if (searchMode) {
    return (
      <div className="wit-header-small d-flex align-items-center justify-content-between gap-1">
        <button className="wit-header-search d-flex align-items-center" onClick={() => setSearchMode(false)}>
          <IconArrowLeft />
        </button>
        <div className="w-100">
          <Omnisearch searcher={searcher} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="wit-header d-flex align-items-center justify-content-between">
        <div className="col-4 gap-1 d-flex align-items-center justify-content-start">
          <Menu menu={menu} />
          <button className="wit-header-title d-flex align-items-center" onClick={handleClickHome}>
            <div className="d-flex">{React.createElement(icon)}</div>
            <div className="d-flex">{label}</div>
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
      <div className="wit-header-small d-flex align-items-center justify-content-between">
        <div className="col-6 gap-1 d-flex align-items-center justify-content-start">
          <Menu menu={menu} />
          <button className="wit-header-title d-flex align-items-center" onClick={handleClickHome}>
            <div className="d-flex">{React.createElement(icon)}</div>
            <div className="d-flex">{label}</div>
          </button>
        </div>
        <div className="col-6 gap-3 d-flex align-items-center justify-content-end">
          {searcher ?
            <button className="wit-header-search d-flex align-items-center" onClick={() => setSearchMode(true)}>
              <IconSearch />
            </button> :
            null
          }
          {languages.length > 1 ?
            <HeaderLanguage languages={languages} /> :
            null
          }
          <HeaderUser />
        </div>
      </div>
    </div>
  );
})

export default Header;