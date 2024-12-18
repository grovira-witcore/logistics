// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import AvatarField from './AvatarField.js';
import ComplexField from './ComplexField.js';
import { identity } from '../utils/identity.js';


const Repeater = identity(function ({ fields, hideLabels, contextualActions, onClickItem, items, selectedKey }) {
  const getRenderizableField = function (field, item) {
    const renderizableField = { ...field };
    if (field.visibilityBindIndex !== null && field.visibilityBindIndex !== undefined && !item.data[field.visibilityBindIndex]) {
      delete renderizableField.value;
      delete renderizableField.paragraph;
      delete renderizableField.progressBar;
      delete renderizableField.ratingBar;
    }
    else {
      if (field.bindIndex !== null && field.bindIndex !== undefined) {
        renderizableField.value = item.data[field.bindIndex];
      }
      else if (field.paragraph && field.paragraph.fields) {
        renderizableField.paragraph = {
          template: field.paragraph.template,
          fields: field.paragraph.fields.map(paragraphField => getRenderizableField(paragraphField, item))
        };
      }
      else if (field.progressBar && field.progressBar.fields) {
        renderizableField.progressBar = {
          fields: field.progressBar.fields.map(progressBarField => getRenderizableField(progressBarField, item))
        };
      }
      else if (field.ratingBar && field.ratingBar.fields) {
        renderizableField.ratingBar = {
          fields: field.ratingBar.fields.map(ratingBarField => getRenderizableField(ratingBarField, item))
        };
      }
      if (field.colorBindIndex !== null && field.colorBindIndex !== undefined) {
        renderizableField.color = item.data[field.colorBindIndex];
      }
      if (field.fontWeightBindIndex !== null && field.fontWeightBindIndex !== undefined) {
        renderizableField.fontWeight = item.data[field.fontWeightBindIndex];
      }
      if (field.fontStyleBindIndex !== null && field.fontStyleBindIndex !== undefined) {
        renderizableField.fontStyle = item.data[field.fontStyleBindIndex];
      }
      if (field.textDecorationBindIndex !== null && field.textDecorationBindIndex !== undefined) {
        renderizableField.textDecoration = item.data[field.textDecorationBindIndex];
      }
      if (field.textTransformBindIndex !== null && field.textTransformBindIndex !== undefined) {
        renderizableField.textTransform = item.data[field.textTransformBindIndex];
      }
      if (field.avatarField) {
        renderizableField.avatarField = getRenderizableField(field.avatarField, item);
      }
      if (field.secondaryField) {
        renderizableField.secondaryField = getRenderizableField(field.secondaryField, item);
      }
      if (field.comparativeField) {
        renderizableField.comparativeField = getRenderizableField(field.comparativeField, item);
      }
    }
    return renderizableField;
  }

  const contextualActionClick = function (e, contextualAction, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    contextualAction.onClick(e, item);
  }

  const renderItem = function (item) {
    if (fields.length === 0) {
      return null;
    }
    const firstField = fields[0];
    const renderizableFirstField = getRenderizableField(firstField, item);
    if (onClickItem) {
      renderizableFirstField.onClick = function (e) {
        if (e.ctrlKey || e.altKey) {
          return;
        }
        if (onClickItem) {
          onClickItem(e, item);
        }
      };
    }
    if (renderizableFirstField.avatarField || renderizableFirstField.icon) {
      return (
        <div className="d-flex pt-3">
          <div className="ps-2 pt-1">
            <AvatarField size="lg" field={renderizableFirstField} />
          </div>
          {renderItemBody(item, renderizableFirstField)}
        </div>
      );
    }
    else {
      return (
        <div className="pt-3">
          {renderItemBody(item, renderizableFirstField)}
        </div>
      );
    }
  }
  const renderItemBody = function (item, renderizableFirstField) {
    return (
      <div>
        <div className="pb-1 ps-2">
          <ComplexField size="lg" field={renderizableFirstField} />
        </div>
        <div className="table-responsive">
          <table className="table mb-2">
            <tbody>
              {fields.map(function (field, index) {
                if (index > 0) {
                  const renderizableField = getRenderizableField(field, item);
                  return (
                    <tr key={'field-' + index}>
                      {hideLabels ?
                        null :
                        <td className="w-auto text-default text-sm fw-bold" style={{ border: 'none', minWidth: 180 }}>
                          {renderizableField.label}
                        </td>
                      }
                      <td className="w-100" style={{ border: 'none' }}>
                        <div className={'d-flex align-items-center' + (hideLabels ? '' : ' justify-content-end')}>
                          <AvatarField size="sm" field={renderizableField} />
                          <ComplexField size="sm" field={renderizableField} />
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
        {contextualActions.length > 0 ?
          <div className="d-flex mb-2" style={{ zIndex: 100000 }}>
            {contextualActions.map((contextualAction, index) =>
              !(contextualAction.hidden && contextualAction.hidden(item)) ? (
                <div key={'contextual-action-' + index} className="ps-2">
                  <button className={'p-2 d-flex btn-outline-' + contextualAction.color + ' border-0'} onClick={(e) => contextualActionClick(e, contextualAction, item)}>
                    <div className="icon-sm">
                      {React.createElement(contextualAction.icon)}
                    </div>
                    <div className="ps-2">
                      {contextualAction.label}
                    </div>
                  </button>
                </div>
              ) : null
            )}
          </div> :
          null
        }
      </div>
    )
  }

  return (
    <div className="pb-2">
      {items.map((item) => (
        <div
          key={item.key}
          className={'border-bottom ' + (selectedKey === item.key ? 'current' : '')}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
});

export default Repeater;