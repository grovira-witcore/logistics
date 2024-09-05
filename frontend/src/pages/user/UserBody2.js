import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Tabs from '../../components/Tabs.js';
import IconRole from '../../components/icons/IconRole.js';
import UserBody2Part1 from './UserBody2Part1.js';
import { getWords } from '../../utils/get-words.js';

const UserBody2 = ReactRouterDOM.withRouter(function ({ user }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <Tabs
        tabs={[
          { icon: IconRole, label: words.roles, component: UserBody2Part1, arguments: { user: user }, hidden: !(user) },
        ]}
      />
    </div>
  );
})

export default UserBody2;
