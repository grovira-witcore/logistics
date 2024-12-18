import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import TextBox from '../../components/TextBox.js';
import { getWords } from '../../utils/get-words.js';

const UsersBodyActionResetPassword = ReactRouterDOM.withRouter(function ({ username, data, updateData, validated }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.username}
              value={username}
              disabled
            />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.temporaryPassword}
              value={data.temporaryPassword}
              onChange={(value) => updateData('temporaryPassword', value)}
              validated={validated}
              password={true}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default UsersBodyActionResetPassword;