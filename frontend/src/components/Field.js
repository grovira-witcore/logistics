// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { format } from '../utils/format.js';
import { getWords } from '../utils/get-words.js';

const Field = identity(function ({ value, type, translate, json, frame, formatter, color, fontWeight, fontStyle, textDecoration, textTransform }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const roughFormat = function (key, value) {
    if (typeof value === 'string') {
      if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(value)) {
        const date = new Date(value);
        if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
          return format(value, 'date', { dateFormat: i18n.dateFormat });
        }
        else {
          return format(value, 'datetime', { dateFormat: i18n.dateFormat });
        }
      }
    }
    else if (typeof value === 'number') {
      const isInteger = Number.isInteger(value); 
      if (isInteger && value >= 946684800000 && value <= 2871676800000) {
        const date = new Date(value);
        if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
          return format(value, 'date', { dateFormat: i18n.dateFormat });
        }
        else {
          return format(value, 'datetime', { dateFormat: i18n.dateFormat });
        }
      }
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('amount') || lowerKey.includes('money') || lowerKey.includes('price') || lowerKey.includes('income') || lowerKey.includes('profit') || lowerKey.includes('revenue')) {
        return format(value, 'money', { moneySymbol: i18n.moneySymbol });
      }
      if (lowerKey.includes('percentage') && value >= 0 && value <= 1) {
        return format(value, 'percentage', {});
      }
      return format(value, isInteger ? 'integer' : 'decimal', {});
    }
    return value;
  }

  if (type === 'boolean') {
    if (value) {
      return (
        <div>
          {words.yes}
        </div>
      );
    }
    else {
      return (
        <div>
          {words.no}
        </div>
      );
    }
  }
  else if (json) {
    return (
      <div>
        {Object.keys(value).map(key => (
          <div key={'key-' + key} className="d-flex gap-1">
            <div className="fw-bold">{words[key]}</div>
            <div className="fw-bold">{':'}</div>
            <div>{roughFormat(key, value[key])}</div>
          </div>
        ))}
      </div>
    );
  }
  else if (frame) {
    return (
      <div className={'outline-' + (color ?? 'default')}>
        {format(translate ? words[value] : value, type, { formatter: formatter, words: words, dateFormat: i18n.dateFormat, moneySymbol: i18n.moneySymbol })}
      </div>
    );
  }
  else {
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
    if (value && (typeof value === 'string') && /^(https?:\/\/|www\.)[^\s\/$.?#].[^\s]*$/i.test(value)) {
      if (classNameParts.length > 0) {
        return (
          <div className={classNameParts.join(' ')} style={{ whiteSpace: 'pre-line' }}>
            <a href={value.startsWith('www.') ? ('https://' + value) : value} target="_blank">{value}</a>
          </div>
        );
      }
      else {
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            <a href={value.startsWith('www.') ? ('https://' + value) : value} target="_blank">{value}</a>
          </div>
        );
      }
    }
    else {
      if (classNameParts.length > 0) {
        return (
          <div className={classNameParts.join(' ')} style={{ whiteSpace: 'pre-line' }}>
            {format(translate ? words[value] : value, type, { formatter: formatter, words: words, dateFormat: i18n.dateFormat, moneySymbol: i18n.moneySymbol })}
          </div>
        );
      }
      else {
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {format(translate ? words[value] : value, type, { formatter: formatter, words: words, dateFormat: i18n.dateFormat, moneySymbol: i18n.moneySymbol })}
          </div>
        );
      }
    }
  }
});

export default Field;