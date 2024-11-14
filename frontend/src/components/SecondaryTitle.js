// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';

const SecondaryTitle = identity(function ({ label }) {
  return (
    <div className="wit-secondary-title d-flex align-items-center">
      <div className="wit-secondary-title-label">{label}</div>
    </div>
  );
});

export default SecondaryTitle;