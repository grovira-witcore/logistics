import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import TextBox from '../../components/TextBox.js';
import ComboBox from '../../components/ComboBox.js';
import { getWords } from '../../utils/get-words.js';

const UsersBodyActionAdd = ReactRouterDOM.withRouter(function ({ securityOptions, data, updateData, validated }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.username}
              value={data.username}
              onChange={(value) => updateData('username', value)}
              validated={validated}
              required={true}
              focus
            />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.firstName}
              value={data.firstName}
              onChange={(value) => updateData('firstName', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.lastName}
              value={data.lastName}
              onChange={(value) => updateData('lastName', value)}
              validated={validated}
              required={true}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
            <TextBox
              label={words.email}
              value={data.email}
              onChange={(value) => updateData('email', value)}
              validated={validated}
              regex={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
              regexText={words.invalidEmail}
              required={true}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.role}
              value={data.role}
              onChange={(value) => updateData('role', value)}
              validated={validated}
              dataSource={securityOptions.roles.map(role => [role, words[role]])}
              required={true}
            />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          {[
            (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0 ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                <ComboBox
                  label={words.provider}
                  value={data.providerName}
                  onChange={(value) => updateData('providerName', value)}
                  validated={validated}
                  dataSource={securityOptions.enableProvidersNames.map(providerName => [providerName, providerName])}
                  required={!securityOptions.enableByUserPassword}
                />
              </div> :
              null
            ),
            (securityOptions.enableByUserPassword && (data.providerName === null || data.providerName === undefined) ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                <TextBox
                  label={words.temporaryPassword}
                  value={data.temporaryPassword}
                  onChange={(value) => updateData('temporaryPassword', value)}
                  validated={validated}
                  password={true}
                  required={true}
                />
              </div> :
              null
            )
          ]}
        </div>
      </div>
    </div>
  );
})

export default UsersBodyActionAdd;
