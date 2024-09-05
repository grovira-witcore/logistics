import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Title from '../../components/Title.js';
import Brief from '../../components/Brief.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';

const UserBody1 = ReactRouterDOM.withRouter(function ({ user }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title avatar={user.avatar} label={protect(function ([firstName, lastName]) { return `${firstName} ${lastName}` }, [ user.firstName, user.lastName ])} secondaryLabel={user.username} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
        </div>
      </div>
      <Brief
        fields={[
          {
            label: words.email,
            type: 'string',
            value: user.email,
          },
          {
            label: words.enabled,
            type: 'boolean',
            value: user.enabled,
          },
        ]}
      />
    </div>
  );
})

export default UserBody1;
