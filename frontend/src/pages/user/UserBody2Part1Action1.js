import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import NumericBox from '../../components/NumericBox.js';
import ComboBox from '../../components/ComboBox.js';
import { getWords } from '../../utils/get-words.js';

const UserBody2Part1Action1 = ReactRouterDOM.withRouter(function ({ user, data, updateData, validated }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap">
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <NumericBox
              label={words.user}
              value={data.userId}
              onChange={(value) => updateData('userId', value)}
              validated={validated}
              focus
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
            <ComboBox
              label={words.role}
              value={data.role}
              onChange={(value) => updateData('role', value)}
              validated={validated}
              dataSource={[['administrator', words.administrator]]}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default UserBody2Part1Action1;
