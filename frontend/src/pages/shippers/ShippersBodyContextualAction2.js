import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
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
              value: shipper.name,
              fontWeight: 'bold',
            },
          ]}
        />
      </div>
    </div>
  );
})

export default ShippersBodyContextualAction2;
