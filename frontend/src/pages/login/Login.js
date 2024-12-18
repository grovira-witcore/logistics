import React from 'react';
import IconLogo from '../../components/icons/IconLogo.js';
import LoginUserPassword from './LoginUserPassword.js';
import LoginUserPasswordChange from './LoginUserPasswordChange.js';
import { identity } from '../../utils/identity.js';
import { getWords } from '../../utils/get-words.js';

const Login = identity(function ({ defaultI18n }) {
  const [mustChange, setMustChange] = React.useState(null);
  
  const words = getWords(defaultI18n.code);
  
  return (
    <div>
      <div className="wit-header d-flex align-items-center justify-content-between">
        <div className="wit-header-title d-flex align-items-center">
          <div><IconLogo /></div>
          <div>{words.ggtLogistics}</div>
        </div>
      </div>
      <div className="wit-header-small d-flex align-items-center justify-content-between">
        <div className="wit-header-title d-flex align-items-center">
          <div><IconLogo /></div>
          <div>{words.ggtLogistics}</div>
        </div>
      </div>
      <div className="wit-body d-flex justify-content-center align-items-center">
        <div className="section" style={{ width: '360px' }}>
          {mustChange ?
            <div style={{ paddingTop: '24px' }}>
              <div className="d-flex justify-content-center align-items-center" style={{ fontWeight: 'bold', fontSize: '24px', paddingBottom: '24px' }}>
                {words.changeYourPassword}
              </div>
              <LoginUserPasswordChange defaultI18n={defaultI18n} username={mustChange.username} setMustChange={setMustChange} />
            </div> :
            <div style={{ paddingTop: '24px' }}>
              <div className="d-flex justify-content-center align-items-center" style={{ fontWeight: 'bold', fontSize: '24px', paddingBottom: '24px' }}>
                {words.logInToContinue}
              </div>
              <LoginUserPassword defaultI18n={defaultI18n} setMustChange={setMustChange} />
            </div>
          }
        </div>
      </div>
    </div>
  );
});

export default Login;
