// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import IconEdit from './icons/IconEdit';
import { usePageContext } from '../contexts/PageContext.js';
import { identity } from '../utils/identity.js';

const EditableBox = identity(function ({ component, properties, initialValue, updater, alignment, children }) {
  const { refresh } = usePageContext();

  const [editMode, setEditMode] = React.useState(false);
  const [value, setValue] = React.useState(null);

  const handleEdit = function (e) {
    setValue(initialValue);
    setEditMode(true);
  }

  const handleOk = async function (e) {
    await updater(value);
    refresh();
  }

  const handleCancel = function (e) {
    setEditMode(false);
  }

  if (editMode) {
    return (
      <div className={'d-flex justify-content-' + alignment}>
        {React.createElement(component, {...properties, value: value, onChange: setValue, validated: true, focus: true, inline: true, onOk: handleOk, onCancel: handleCancel })}
      </div>
    );
  }
  else {
    return (
      <div className={'d-flex justify-content-' + alignment + ' gap-2'}>
        <div>
          {children}
        </div>
        <button className='edit-icon' onClick={handleEdit}>
          <IconEdit />
        </button>
      </div>
    );
  }
});

export default EditableBox;
