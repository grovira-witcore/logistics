// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import Field from './Field.js';
import { identity } from '../utils/identity.js';
import { protect } from '../utils/protect.js';

const Paragraph = identity(function ({ template, fields, color, fontWeight, fontStyle, textDecoration, textTransform }) {
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
            json={field.json}
            frame={field.frame}
            formatter={field.formatter}
            color={field.color}
            fontWeight={field.fontWeight}
            fontStyle={field.fontStyle}
            textDecoration={field.textDecoration}
            textTransform={field.textTransform}
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
  if (fontWeight) {
    classNameParts.push('text-' + fontWeight);
  }
  if (fontStyle) {
    classNameParts.push('text-' + fontStyle);
  }
  if (textDecoration) {
    classNameParts.push('text-' + textDecoration);
  }
  if (textTransform) {
    classNameParts.push('text-' + textTransform);
  }
  if (classNameParts.length > 0) {
    return (
      <div className={classNameParts.join(' ')}>
        {parts.map(function (part, index) {
          return (<div key={'part-' + index} className={(index > 0 ? 'ps-1 ' : '') + 'd-inline-block'}>{part}</div>);
        })}
      </div>
    );
  }
  else {
    return (
      <div>
        {parts.map(function (part, index) {
          return (<div key={'part-' + index} className={(index > 0 ? 'ps-1 ' : '') + 'd-inline-block'}>{part}</div>);
        })}
      </div>
    );
  }
});

export default Paragraph;