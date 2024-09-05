import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Paragraph from '../../components/Paragraph.js';
import { getWords } from '../../utils/get-words.js';

const UserBody2Part1ContextualAction1 = ReactRouterDOM.withRouter(function ({ userRole }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="prompt d-flex justify-content-center">
        <Paragraph
          template={words.confirmDeleteUserRole}
          fields={[
            {
              type: 'string',
              translate: true,
              style: function (value) { return 'fw-bold'; },
              value: userRole.role,
            },
          ]}
        />
      </div>
    </div>
  );
})

export default UserBody2Part1ContextualAction1;
