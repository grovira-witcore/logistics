// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../context/AppContext.js';
import FieldProgressBar from './FieldProgressBar.js';
import FieldRatingBar from './FieldRatingBar.js';
import { format } from '../utils/format.js';
import { getWords } from '../utils/get-words.js';

const Field = function ({ value, type, translate, variant, formatter, color, style }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

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
  else {
    switch (variant) {
      case 'frame': {
        return (
          <div className={'outline-' + (color ?? 'default')}>
            {format(translate ? words[value] : value, type, { formatter: formatter, words: words, dateFormat: i18n.dateFormat, moneySymbol: i18n.moneySymbol })}
          </div>
        );
      }
      case 'progress-bar': {
        return (
          <FieldProgressBar value={value} color={color} />
        );
      }
      case 'rating-bar': {
        return (
          <FieldRatingBar value={value} color={color} />
        );
      }
      default: {
        const classNameParts = [];
        if (color) {
          classNameParts.push('text-' + color);
        }
        if (style) {
          classNameParts.push(style);
        }
        if (value && (typeof value === 'string') && /^(https?:\/\/|www\.)[^\s\/$.?#].[^\s]*$/i.test(value)) {
          if (classNameParts.length > 0) {
            return (
              <div className={classNameParts.join(' ')} style={{ whiteSpace: 'pre-line' }}>
                <a href={value.startsWith('www.') ? ('http://' + value) : value} target="_blank">{value}</a>
              </div>
            );
          }
          else {
            return (
              <div style={{ whiteSpace: 'pre-line' }}>
                <a href={value.startsWith('www.') ? ('http://' + value) : value} target="_blank">{value}</a>
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
    }
  }
}

export default Field;