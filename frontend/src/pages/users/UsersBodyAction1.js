import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import TextBox from '../../components/TextBox.js';
import ComboBox from '../../components/ComboBox.js';
import { getWords } from '../../utils/get-words.js';

const UsersBodyAction1 = ReactRouterDOM.withRouter(function ({ data, updateData, validated }) {
  const { i18n, setError } = useAppContext();
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
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <TextBox
              label={words.lastName}
              value={data.lastName}
              onChange={(value) => updateData('lastName', value)}
              validated={validated}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-12">
            <TextBox
              label={words.email}
              value={data.email}
              onChange={(value) => updateData('email', value)}
              validated={validated}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.enabled}
              value={data.enabled}
              onChange={(value) => updateData('enabled', value)}
              validated={validated}
              dataSource={[[true, words.yes], [false, words.no]]}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default UsersBodyAction1;
