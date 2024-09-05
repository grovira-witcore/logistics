import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Paragraph from '../../components/Paragraph.js';
import { getWords } from '../../utils/get-words.js';

const TransportersBodyContextualAction2 = ReactRouterDOM.withRouter(function ({ transporter }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="prompt d-flex justify-content-center">
        <Paragraph
          template={words.confirmDeleteTransporter}
          fields={[
            {
              type: 'string',
              style: function (value) { return 'fw-bold'; },
              value: transporter.name,
            },
          ]}
        />
      </div>
    </div>
  );
})

export default TransportersBodyContextualAction2;
