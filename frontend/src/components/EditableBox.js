// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import IconEdit from './icons/IconEdit';

const EditableBox = function ({ component, properties, initialValue, updater, alignment, children }) {
  const [editMode, setEditMode] = React.useState(false);
  const [value, setValue] = React.useState(null);

  const handleEdit = function (e) {
    setValue(initialValue);
    setEditMode(true);
  }

  const handleOk = async function (e) {
    await updater(value);
    window.location.reload();
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
        <div className='edit-icon' onClick={handleEdit}>
          <IconEdit />
        </div>
      </div>
    );
  }
}

export default EditableBox;
