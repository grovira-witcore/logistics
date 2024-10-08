// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { protect } from '../utils/protect.js';

const AvatarField = function ({ size, field }) {

  if ((field.value === null || field.value === undefined || field.value === '') && (field.paragraph === null || field.paragraph === undefined)) {
    return (<div />);
  }

  if (field.avatarField) {
    return (
      <div className="pe-2">
        <div className={'image-' + size + ' mx-auto'}>
          {field.avatarField.value ?
            <img src={field.avatarField.value} alt="Image" className="img-fluid rounded-circle" /> :
            null
          }
        </div>
      </div>
    );
  }
  else if (field.icon) {
    return (
      <div className="pe-2">
        <div className={'icon-' + size + ' ' + (protect(field.color, field.value) ? ' text-' + protect(field.color, field.value) : '')}>
          {React.createElement(field.icon)}
        </div>
      </div>
    );
  }
  else {
    return (<div />);
  }
  
}

export default AvatarField;