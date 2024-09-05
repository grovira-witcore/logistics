import React from 'react';
import IconLogo from '../components/icons/IconLogo.js';
import { getWords } from '../utils/get-words.js';

let _sessions = null;

const getCurrentSession = function () {
  let currentUsername = sessionStorage.getItem('username');
  if (currentUsername === null || currentUsername === undefined) {
    sessionStorage.setItem('username', 'admin');
    currentUsername = 'admin';
  }
  return _sessions.find(session => session.username === currentUsername);
}

const init = function (root, defaultI18n, cb) {
  fetch(`/api/sessions`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      if (response.ok) {
        response.json()
          .then(function (sessions) {
            _sessions = sessions;
            const currentSession = getCurrentSession();
            if (currentSession) {
              root.render(cb());
            }
            else {
              const words = getWords(defaultI18n.code);
              root.render(
                <div>
                  <div className="wit-header d-flex align-items-center">
                    <div className="wit-header-title d-flex align-items-center">
                      <div><IconLogo/></div>
                      <div>{words.ggtLogistics}</div>
                    </div>
                  </div>
                  <div className="canvas d-flex justify-content-center flex-wrap">
                    {_sessions.map(session => (
                      <div index={session.username} className="section" style={{ width: '300px' }}>
                        <div style={{ padding: '20px' }}>
                          <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                            <div>
                              <div className="image-lg mx-auto">
                                {session.avatar ?
                                  <img src={session.avatar} alt="Image" className="img-fluid rounded-circle" /> :
                                  <div />
                                }
                              </div>
                            </div>
                            <div style={{ fontFamily: 'Inter-SemiBold', fontSize: '18px' }}>
                              {session.firstName + ' ' + session.lastName}
                              <div className='text-gray' style={{ fontFamily: 'Inter-Regular', fontSize: '12px' }}>
                                {session.username}
                              </div>
                            </div>
                          </div>
                          <div className="text-center" style={{ paddingTop: '20px' }}>
                            <div className="btn-green" onClick={function (e) { sessionStorage.setItem('username', session.username); window.location.reload(); }}>
                              {words.login}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          });
      }
      else {
        const words = getWords(defaultI18n.code);
        root.render(
          <div>
            <div className="wit-header d-flex align-items-center">
              <div className="wit-header-title d-flex align-items-center">
                <div><IconLogo/></div>
                <div>{words.ggtLogistics}</div>
              </div>
            </div>
            <div className="text-gray" style={{ fontFamily: 'Inter-SemiBold', fontSize: '18px',  marginTop: '120px' }}>
              <div className="text-center" style={{ paddingTop: '30px' }}>
                {'Oops! Our backend service hasn\'t loaded yet.'}
              </div>
              <div className="text-center" style={{ paddingTop: '30px' }}>
                {'Please wait a few seconds and try again.'}
              </div>
            </div>
          </div>
        );
      }
    });
}

const logout = function () {
  sessionStorage.clear();
  sessionStorage.setItem('username', '-');
  window.location.reload();
  window.location.href = '/';
}

const getToken = function () {
  const currentSession = getCurrentSession();
  if (currentSession) {
    return currentSession.accessToken;
  }
  else {
    return null;
  }
}

const hasRole = function (role) {
  const currentSession = getCurrentSession();
  if (currentSession) {
    return currentSession.roles.includes(role);
  }
  else {
    return false;
  }
}

const updateToken = function (cb) {
  cb();
}

const getUserData = function () {
  const currentSession = getCurrentSession();
  if (currentSession) {
    return {
      username: currentSession.username,
      firstName: currentSession.firstName,
      lastName: currentSession.lastName,
      email: currentSession.email,
      avatar: currentSession.avatar
    }
  }
  else {
    return null;
  }
}

const SecurityService = {
  init,
  logout,
  getToken,
  hasRole,
  updateToken,
  getUserData
}

export default SecurityService;
