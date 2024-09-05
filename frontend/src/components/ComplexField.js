// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import IconNeutral from './icons/IconNeutral';
import IconIncrement from './icons/IconIncrement';
import IconDecrement from './icons/IconDecrement';
import Paragraph from './Paragraph.js';
import Field from './Field.js';
import { protect } from '../utils/protect.js';

const ComplexField = function ({ size, field }) {

  if ((field.value === null || field.value === undefined || field.value === '') && (field.paragraph === null || field.paragraph === undefined)) {
    return (<div/>);
  }

  return (
    <div
      className={'text-' + size + (field.onClick ? ' text-link' : ' text-default')}
      onClick={field.onClick}
    >
      {field.paragraph ?
        <Paragraph
          template={field.paragraph.template}
          fields={field.paragraph.fields}
          color={protect(field.color, field.value)}
          style={protect(field.style, field.value)}
        /> :
        <Field
          value={field.value}
          type={field.type}
          translate={field.translate}
          variant={field.variant}
          formatter={field.formatter}
          color={protect(field.color, field.value)}
          style={protect(field.style, field.value)}
        />
      }
      {field.secondaryField && ((field.secondaryField.value !== null && field.secondaryField.value !== undefined && field.secondaryField.value !== '') || (field.secondaryField.paragraph !== null && field.secondaryField.paragraph !== undefined)) ?
        <div className="text-secondary">
          {field.secondaryField.paragraph ?
            <Paragraph
              template={field.secondaryField.paragraph.template}
              fields={field.secondaryField.paragraph.fields}
              color={protect(field.secondaryField.color, field.secondaryField.value)}
              style={protect(field.secondaryField.style, field.secondaryField.value)}
            /> :
            <Field
              value={field.secondaryField.value}
              type={field.secondaryField.type}
              translate={field.secondaryField.translate}
              variant={field.secondaryField.variant}
              formatter={field.secondaryField.formatter}
              color={protect(field.secondaryField.color, field.secondaryField.value)}
              style={protect(field.secondaryField.style, field.secondaryField.value)}
            />
          }
        </div> :
        null
      }
      {field.comparativeField && field.comparativeField.value !== null && field.comparativeField.value !== undefined && field.comparativeField.value !== '' ?
        (field.value === field.comparativeField.value ?
          <div className="d-flex align-items-center text-disabled icon-sm">
            <IconNeutral/>
            <div className="ps-2">
              <Field value={field.value - field.comparativeField.value} type={field.type} />
            </div>
            <div className="ps-2">{'('}</div>
            <Field value={(field.value - field.comparativeField.value) / field.comparativeField.value} type="percentage" />
            <div>{')'}</div>
          </div> :
          (field.value > field.comparativeField.value ?
            <div className="d-flex align-items-center text-green icon-sm">
              <IconIncrement/>
              <div className="ps-2">
                <Field value={field.value - field.comparativeField.value} type={field.type} />
              </div>
              <div className="ps-2">{'('}</div>
              <Field value={(field.value - field.comparativeField.value) / field.comparativeField.value} type="percentage" />
              <div>{')'}</div>
            </div> :
            <div className="d-flex align-items-center text-red icon-sm">
              <IconDecrement/>
              <div className="ps-2">
                <Field value={field.value - field.comparativeField.value} type={field.type} />
              </div>
              <div className="ps-2">{'('}</div>
              <Field value={(field.value - field.comparativeField.value) / field.comparativeField.value} type="percentage" />
              <div>{')'}</div>
            </div>
          )
        ) :
        null
      }
    </div>
  );
  
}

export default ComplexField;