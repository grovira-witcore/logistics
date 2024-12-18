// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../contexts/AppContext.js';
import IconMenu from './icons/IconMenu.js';
import IconMenuExpanded from './icons/IconMenuExpanded.js';
import IconMenuCollapsed from './icons/IconMenuCollapsed.js';

const Menu = ReactRouterDOM.withRouter(function ({ menu }) {
  const { setError } = useAppContext();
  const [showMenu, setShowMenu] = React.useState(false);
  const [collapsedMenuGroupIndexes, setCollapsedMenuGroupIndexes] = React.useState([]);

  const history = ReactRouterDOM.useHistory();

  const handleClickMenu = function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setError(null);
    setShowMenu(true);
    setCollapsedMenuGroupIndexes([]);
  }

  const handleClickMenuGroup = function (e, menuGroupIndex) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const collapsed = collapsedMenuGroupIndexes.indexOf(menuGroupIndex) !== -1;
    if (collapsed) {
      setCollapsedMenuGroupIndexes((prevCollapsedMenuGroupIndexes) => prevCollapsedMenuGroupIndexes.filter(menuGroupIndexX => menuGroupIndexX !== menuGroupIndex))
    }
    else {
      setCollapsedMenuGroupIndexes((prevCollapsedMenuGroupIndexes) => [...prevCollapsedMenuGroupIndexes, menuGroupIndex])
    }
  }

  const handleClickMenuOption = function (e, path) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setError(null);
    setShowMenu(false);
    history.push(path);
  }

  if (menu && (!menu.some(menuGroup => menuGroup && menuGroup.options.length > 0) || menu.some(menuGroup => menuGroup && menuGroup.options.some(menuOption => !menuOption.hidden)))) {
    return (
      <div>
        <button className="wit-menu-button" onClick={handleClickMenu}>
          <IconMenu />
        </button>
        <ReactBootstrap.Offcanvas className="wit-menu" style={{ width: 280 }} show={showMenu} onHide={() => setShowMenu(false)}>
          <ReactBootstrap.Offcanvas.Body className="p-0">
            {menu.map(function (menuGroup, menuGroupIndex) {
              if (menuGroup === null || menuGroup === undefined) {
                return null;
              }
              const filteredMenuOptions =  menuGroup.options.filter(menuOption => !menuOption.hidden);
              if (menuGroup.options.length > 0 && filteredMenuOptions.length === 0) {
                return null;
              }
              const collapsed = collapsedMenuGroupIndexes.indexOf(menuGroupIndex) !== -1;
              return (
                <div key={'group-' + menuGroupIndex} className="wit-menu-group">
                  <button className="d-flex justify-content-between align-items-center" onClick={(e) => handleClickMenuGroup(e, menuGroupIndex)}>
                    <div className="flex-1">{menuGroup.label}</div>
                    <div>
                      {collapsed ?
                        <IconMenuCollapsed /> :
                        <IconMenuExpanded />
                      }
                    </div>
                  </button>
                  {!collapsed ?
                    filteredMenuOptions.map((menuOption, menuOptionIndex) => (
                      <button key={'option-' + menuOptionIndex} className="wit-menu-option d-flex align-items-center" onClick={(e) => handleClickMenuOption(e, menuOption.path)}>
                        <div className="wit-menu-option-icon d-flex align-items-center">{React.createElement(menuOption.icon)}</div>
                        <div className="wit-menu-option-label">{menuOption.label}</div>
                      </button>
                    )) :
                    null
                  }
                </div>
              );
            })}
          </ReactBootstrap.Offcanvas.Body>
        </ReactBootstrap.Offcanvas>
      </div>
    );
  }
  else {
    return (<div />);
  }
})

export default Menu;