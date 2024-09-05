// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import Field from './Field.js';
import { protect } from '../utils/protect.js';
import { format } from '../utils/format.js';

const Paragraph = function ({ template, fields, color, style }) {

  if (template === 'ProgressBar') { // Temporal
    return (
      <div>
        <div className="progress bg-disabled" style={{ width: '200px' }}>
          <div className="progress-bar bg-yellow" style={{ width: Math.floor(fields[0].value * 200) + 'px' }}>
            <div className="progress-bar bg-green" style={{ height: '100px', width: Math.floor(fields[1].value * 200) + 'px' }}>
            </div>
          </div>
        </div>
        <div className="pt-1 d-flex">
          <div className="text-green">{format(fields[1].value, 'percentage', {})}</div>
          <div className="px-2 fw-bold">{'/'}</div>
          <div className="text-yellow">{format(fields[0].value - fields[1].value, 'percentage', {})}</div>
        </div>
      </div>
    );
  }

  const parts = [];
  let subTemplate = template;
  let match = /({\d+})/g.exec(subTemplate);
  while (match) {
    if (match.index > 0) {
      const partText = subTemplate.substring(0, match.index).trim();
      if (partText !== null) {
        parts.push(partText);
      }
    }
    const index = parseInt(match[0].substring(1, match[0].length - 1));
    if (fields.length > index) {
      const field = fields[index];
      parts.push(
        <div>
          <Field
            value={field.value}
            type={field.type}
            translate={field.translate}
            variant={field.variant}
            formatter={field.formatter}
            color={protect(field.color, field.value)}
            style={protect(field.style, field.value)}
          />
        </div>
      );
    }
    else {
      parts.push('{' + index + '}');
    }
    subTemplate = subTemplate.substring(match.index + match[0].length);
    match = /({\d+})/g.exec(subTemplate);
  }
  if (subTemplate !== '') {
    parts.push(subTemplate);
  }

  const classNameParts = [];
  if (color) {
    classNameParts.push('text-' + color);
  }
  if (style) {
    classNameParts.push(style);
  }
  if (classNameParts.length > 0) {
    return (
      <div className={classNameParts.join(' ')}>
        {parts.map(function (part, index) {
          return (<div key={index} className={(index > 0 ? 'ps-1 ' : '') + 'd-inline-block'}>{part}</div>);
        })}
      </div>
    );
  }
  else {
    return (
      <div>
        {parts.map(function (part, index) {
          return (<div key={index} className={(index > 0 ? 'ps-1 ' : '') + 'd-inline-block'}>{part}</div>);
        })}
      </div>
    );
  }
}

export default Paragraph;