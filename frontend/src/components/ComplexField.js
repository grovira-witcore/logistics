// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import IconNeutral from './icons/IconNeutral';
import IconIncrement from './icons/IconIncrement';
import IconDecrement from './icons/IconDecrement';
import Paragraph from './Paragraph.js';
import ProgressBar from './ProgressBar.js';
import RatingBar from './RatingBar.js';
import Field from './Field.js';
import { identity } from '../utils/identity.js';
import { protect } from '../utils/protect.js';

const ComplexField = identity(function ({ size, field }) {

  if ((field.value === null || field.value === undefined || field.value === '') && (field.paragraph === null || field.paragraph === undefined) && (field.progressBar === null || field.progressBar === undefined) && (field.ratingBar === null || field.ratingBar === undefined)) {
    return (<div/>);
  }

  const renderField = function (field) {
    if (field.paragraph) {
      let firstParagraphFieldValue = null;
      if (field.paragraph.fields.length > 0) {
        firstParagraphFieldValue = field.paragraph.fields[0].value;
      }
      return (
        <Paragraph
          template={field.paragraph.template}
          fields={field.paragraph.fields}
          color={field.color}
          fontWeight={field.fontWeight}
          fontStyle={field.fontStyle}
          textDecoration={field.textDecoration}
          textTransform={field.textTransform}
        />
      );
    }
    else if (field.progressBar) {
      return (
        <ProgressBar
          fields={field.progressBar.fields}
        />
      );
    }
    else if (field.ratingBar) {
      return (
        <RatingBar
          field={field.ratingBar.fields[0]}
        />
      );
    }
    else {
      return (
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
      );
    }
  }

  const internalElement = (
    <div>
      {renderField(field)}
      {field.secondaryField && ((field.secondaryField.value !== null && field.secondaryField.value !== undefined && field.secondaryField.value !== '') || (field.secondaryField.paragraph !== null && field.secondaryField.paragraph !== undefined)) ?
        <div className="text-secondary">
          {renderField(field.secondaryField)}
        </div> :
        null
      }
      {field.comparativeField && field.comparativeField.value !== null && field.comparativeField.value !== undefined && field.comparativeField.value !== '' ?
        (field.value === field.comparativeField.value ?
          <div className="d-flex align-items-center text-disabled icon-sm">
            <IconNeutral />
            <div className="ps-2">
              <Field value={field.value - field.comparativeField.value} type={field.type} />
            </div>
            <div className="ps-2">{'('}</div>
            <Field value={(field.value - field.comparativeField.value) / field.comparativeField.value} type="percentage" />
            <div>{')'}</div>
          </div> :
          (field.value > field.comparativeField.value ?
            <div className="d-flex align-items-center text-green icon-sm">
              <IconIncrement />
              <div className="ps-2">
                <Field value={field.value - field.comparativeField.value} type={field.type} />
              </div>
              <div className="ps-2">{'('}</div>
              <Field value={(field.value - field.comparativeField.value) / field.comparativeField.value} type="percentage" />
              <div>{')'}</div>
            </div> :
            <div className="d-flex align-items-center text-red icon-sm">
              <IconDecrement />
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

  if (field.onClick) {
    return <button className={'text-' + size + ' text-link'} onClick={field.onClick}>{internalElement}</button>;
  }
  else {
    return <div className={'text-' + size + ' text-default'}>{internalElement}</div>;
  }
});

export default ComplexField;