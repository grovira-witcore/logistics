// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../contexts/AppContext.js';
import IconFlagEn from './icons/IconFlagEn.js';
import IconFlagFr from './icons/IconFlagFr.js';
import IconFlagGe from './icons/IconFlagGe.js';
import IconFlagIt from './icons/IconFlagIt.js';
import IconFlagPo from './icons/IconFlagPo.js';
import IconFlagRu from './icons/IconFlagRu.js';
import IconFlagSp from './icons/IconFlagSp.js';
import IconFlagTu from './icons/IconFlagTu.js';
import IconMenuCollapsed from './icons/IconMenuCollapsed.js';

const HeaderLanguage = ReactRouterDOM.withRouter(function ({ languages }) {
  const { i18n, setI18n } = useAppContext();

  const refInput = React.useRef(null);
  const refTarget = React.useRef(null);

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (refTarget.current && !refTarget.current.contains(e.target)) {
      setShow(false);
    }
  };

  const handleClickLanguage = function (e, language) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    localStorage.setItem('language', language.code.toLowerCase());
    setI18n({
      code: language.code,
      dateFormat: language.dateFormat,
      moneySymbol: language.moneySymbol
    });
    setShow(false);
  }

  const getIconFlag = function (languageCode) {
    switch (languageCode) {
      case 'En': {
        return (<IconFlagEn />);
      }
      case 'Fr': {
        return (<IconFlagFr />);
      }
      case 'Ge': {
        return (<IconFlagGe />);
      }
      case 'It': {
        return (<IconFlagIt />);
      }
      case 'Po': {
        return (<IconFlagPo />);
      }
      case 'Ru': {
        return (<IconFlagRu />);
      }
      case 'Sp': {
        return (<IconFlagSp />);
      }
      case 'Tu': {
        return (<IconFlagTu />);
      }
      default: {
        return null;
      }
    }
  }

  const currentLanguage = languages.find((language) => language.code === i18n.code);

  return (
    <div>
      <button ref={refInput} className="wit-header-language d-flex align-items-center" onClick={(e) => setShow(true)}>
        {getIconFlag(currentLanguage.code)}
        <IconMenuCollapsed />
      </button>
      {show &&
        <ReactBootstrap.Overlay ref={refTarget} show={true} target={refInput.current} placement="bottom-start" onHide={(e) => setShow(false)}>
          <div className="wit-header-language-dd" style={{ zIndex: 100000 }}>
            {languages.map((language) => (
              <button key={language.code} className="d-flex align-items-center" onMouseDown={(e) => e.preventDefault()} onClick={(e) => handleClickLanguage(e, language)}>
                {getIconFlag(language.code)}
                <div>{language.name}</div>
              </button>
            ))}
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
})

export default HeaderLanguage;
