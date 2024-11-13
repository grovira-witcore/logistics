// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../context/AppContext.js';
import IconMenuCollapsed from './icons/IconMenuCollapsed.js';
import IconLogout from './icons/IconLogout.js';
import SecurityService from '../services/SecurityService.js';
import { getWords } from '../utils/get-words.js';

const HeaderUser = ReactRouterDOM.withRouter(function () {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const userData = SecurityService.getUserData();

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

  const handleClickLogout = function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    SecurityService.logout();
  }

  return (
    <div>
      <div ref={refInput} className="wit-header-user d-flex align-items-center cursor-pointer" onClick={(e) => setShow(true)}>
        <div className="image-sm mx-auto rounded-circle">
          <img src={userData.avatar ?? '/images/user.png'} alt="Image" className="img-fluid rounded-circle" /> :
          <div />
        </div>
        <IconMenuCollapsed />
      </div>
      {show &&
        <ReactBootstrap.Overlay ref={refTarget} show={true} target={refInput.current} placement="bottom-start" onHide={(e) => setShow(false)}>
          <div className="wit-header-user-dd d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 100000 }} onMouseDown={(e) => e.preventDefault()}>
            <div className="image-lg mx-auto rounded-circle">
              <img src={userData.avatar ?? '/images/user.png'} alt="Image" className="img-fluid rounded-circle" /> :
              <div />
            </div>
            <div className="wit-header-user-dd-full-name">{userData.firstName + ' ' + userData.lastName}</div>
            <div className="wit-header-user-dd-username">{userData.username}</div>
            <button className="d-flex btn-outline-red" onClick={handleClickLogout}>
              <div className="icon-sm">
                <IconLogout />
              </div>
              <div className="ps-2">
                {words.logout}
              </div>
            </button>
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
})

export default HeaderUser;