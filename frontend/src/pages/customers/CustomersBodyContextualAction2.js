import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Paragraph from '../../components/Paragraph.js';
import { getWords } from '../../utils/get-words.js';

const CustomersBodyContextualAction2 = ReactRouterDOM.withRouter(function ({ customer }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  return (
    <div>
      <div className="prompt d-flex justify-content-center">
        <Paragraph
          template={words.confirmDeleteCustomer}
          fields={[
            {
              type: 'string',
              value: customer.name,
              fontWeight: 'bold',
            },
          ]}
        />
      </div>
    </div>
  );
})

export default CustomersBodyContextualAction2;
