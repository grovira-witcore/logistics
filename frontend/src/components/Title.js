// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const Title = identity(function ({ icon, color, label, secondaryLabel, avatar }) {
  return (
    <div className="wit-title d-flex align-items-center">
      {avatar !== undefined ?
        <div className="d-flex align-items-center cursor-pointer">
          <div className="image-lg mx-auto rounded-circle">
            {avatar ?
              <img src={avatar} alt="Avatar" className="img-fluid rounded-circle" /> :
              null
            }
          </div>
        </div> :
        <div className={'wit-title-icon' + (color ? (' wit-title-icon-' + color) : '')}>
          {React.createElement(icon)}
        </div>
      }
      {secondaryLabel ?
        <div>
          <div className="wit-title-primary-label">{label}</div>
          <div className="wit-title-secondary-label">{secondaryLabel}</div>
        </div> :
        <div className="wit-title-label">{label}</div>
      }
    </div>
  );
});

export default Title;