import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import Paragraph from '../../components/Paragraph.js';
import { getWords } from '../../utils/get-words.js';

const ShippersBodyContextualAction2 = ReactRouterDOM.withRouter(function ({ shipper }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="prompt d-flex justify-content-center">
        <Paragraph
          template={words.confirmDeleteShipper}
          fields={[
            {
              type: 'string',
              style: function (value) { return 'fw-bold'; },
              value: shipper.name,
            },
          ]}
        />
      </div>
    </div>
  );
})

export default ShippersBodyContextualAction2;
