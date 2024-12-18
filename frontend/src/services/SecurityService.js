// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Login from '../pages/login/Login.js';
import IconUser from '../components/icons/IconUser.js';
import Users from '../pages/users/Users.js';
import { jwtDecode } from 'jwt-decode';

let _accessToken = null;
let _accessTokenParsed = null;

const init = function (root, defaultI18n, cb) {
  _accessToken = sessionStorage.getItem('token');
  if (_accessToken) {
    _accessTokenParsed = jwtDecode(_accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    const pendingSeconds = _accessTokenParsed.exp - currentTime;
    if (pendingSeconds <= 60) {
      sessionStorage.clear();
      _accessToken = null;
      _accessTokenParsed = null;
      login(root, defaultI18n);
    }
    else {
      root.render(cb());
    }
  }
  else {
    const authorizationCode = new URLSearchParams(location.search).get('code');
    if (authorizationCode) {
      fetch('/api/auth/token?' + new URLSearchParams({ code: authorizationCode }).toString(), {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          if (response.ok) {
            response.json()
              .then(function (result) {
                sessionStorage.setItem('token', result.accessToken);
                window.location.href = '/';
              })
              .catch(function (err) {
                initError(root, defaultI18n, err);
              });
          }
          else {
            initError(root, defaultI18n, 'Error Response');
          }
        })
        .catch(function (err) {
          initError(root, defaultI18n, err);
        });
    }
    else {
      login(root, defaultI18n);
    }
  }
}
const initError = function (root, defaultI18n, err) {
  console.error(err);
}
const login = function (root, defaultI18n) {
  root.render(<Login defaultI18n={defaultI18n} />);
}

const getAppSecurityMenuGroup = function (words) {
  if (hasRole('administrator')) {
    return {
      label: words.security,
      options: [
        { icon: IconUser, label: words.users, path: "/users" },
      ]
    }
  }
  else {
    return null;
  }
}

const getAppSecurityRoute = function () {
  if (hasRole('administrator')) {
    return (
      <ReactRouterDOM.Route exact path="/users">
        <Users />
      </ReactRouterDOM.Route>
    )
  }
  else {
    return null;
  }
}

const logout = function () {
  fetch('/api/auth/logout', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${_accessToken}`,
    },
    credentials: 'include'
  })
    .then(function (response) {
      if (response.ok) {
        sessionStorage.clear();
        _accessToken = null;
        _accessTokenParsed = null;
        window.location.href = window.location.origin;
      }
      else {
        logoutError('Error Response');
      }
    })
    .catch(function (err) {
      logoutError(err);
    });
}
const logoutError = function (err) {
  console.error(err);
}

const getToken = function () {
  return _accessToken;
}

const hasRole = function (role) {
  return _accessTokenParsed &&
    _accessTokenParsed.role === role;
}

const updateToken = function (cb) {
  const currentTime = Math.floor(Date.now() / 1000);
  const pendingSeconds = _accessTokenParsed.exp - currentTime;
  if (pendingSeconds <= 60) {
    if (_accessTokenParsed.refreshable) {
      fetch('/api/auth/refresh-token', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then(function (response) {
          if (response.ok) {
            response.json()
              .then(function (result) {
                sessionStorage.setItem('token', result.accessToken);
                _accessToken = result.accessToken;
                _accessTokenParsed = jwtDecode(_accessToken);
                cb();
              })
              .catch(function () {
                updateTokenError();
              });
          }
          else {
            updateTokenError();
          }
        })
        .catch(function () {
          updateTokenError();
        });
    }
    else {
      updateTokenError();
    }
  }
  else {
    cb();
  }
}
const updateTokenError = function (err) {
  sessionStorage.clear();
  _accessToken = null;
  _accessTokenParsed = null;
  window.location.href = window.location.origin;
}

const getUserData = function () {
  return {
    username: _accessTokenParsed.username,
    firstName: _accessTokenParsed.given_name || '',
    lastName: _accessTokenParsed.family_name || '',
    email: _accessTokenParsed.email,
    avatar: _accessTokenParsed.avatar
  }
}

const SecurityService = {
  init,
  getAppSecurityMenuGroup,
  getAppSecurityRoute,
  logout,
  getToken,
  hasRole,
  updateToken,
  getUserData
}

export default SecurityService;
