// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import AvatarField from './AvatarField.js';
import ComplexField from './ComplexField.js';


const Grid = function ({ fields, hideLabels, contextualActions, onClickItem, items, selectedKey }) {
  const [current, setCurrent] = React.useState(null);

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
      if (field.paragraph && field.paragraph.fields) {
        renderizableField.paragraph = {
          template: field.paragraph.template,
          fields: field.paragraph.fields.map(paragraphField => getRenderizableField(paragraphField, item))
        };
      }
      if (field.progressBar && field.progressBar.fields) {
        renderizableField.progressBar = {
          fields: field.progressBar.fields.map(progressBarField => getRenderizableField(progressBarField, item))
        };
      }
      if (field.ratingBar && field.ratingBar.fields) {
        renderizableField.ratingBar = {
          fields: field.ratingBar.fields.map(ratingBarField => getRenderizableField(ratingBarField, item))
        };
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

  const handleItemMouseOver = function (e, item) {
    let currentNode = e.target;
    while (currentNode && currentNode.nodeName !== 'TR') {
      currentNode = currentNode.parentNode;
    }
    if (currentNode) {
      setCurrent({
        item: item,
        target: currentNode.childNodes[currentNode.childNodes.length - 1],
        dummy: null
      });
    }
  }

  const contextualActionClick = function (e, contextualAction, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setCurrent(null);
    contextualAction.onClick(e, item);
  }

  const getCssAlignmentTitle = function (alignment) {
    switch (alignment) {
      case 'center': {
        return ' text-center';
      }
      case 'right': {
        return ' text-end';
      }
      default: {
        return '';
      }
    }
  }

  const getCssAlignmentCell = function (alignment) {
    switch (alignment) {
      case 'center': {
        return ' justify-content-center';
      }
      case 'right': {
        return ' justify-content-end';
      }
      default: {
        return '';
      }
    }
  }

  return (
    <div className="table-responsive" onMouseLeave={() => setCurrent(null)}>
      <table className="table">
        {hideLabels ? 
          null :
          <thead>
            <tr onMouseOver={() => setCurrent(null)}>
              {fields.map(function (field, index) {
                return (
                  <th key={index} className={(field.dispensable ? 'd-none d-' + field.dispensable + '-table-cell' : '') + getCssAlignmentTitle(field.alignment)}>
                    <span className="text-lg text-default">{field.label}</span>
                  </th>
                );
              })}
              <th className="p-0 border-0" />
            </tr>
          </thead>
        }
        <tbody>
          {items.map((item) => (
            <tr
              key={item.key}
              className={selectedKey !== item.key ? (current && current.item.key === item.key ? 'hover' + (onClickItem ? ' cursor-pointer' : '') : '') : 'focus'}
              onMouseOver={selectedKey !== item.key ? (e) => handleItemMouseOver(e, item) : null}
              onClick={selectedKey !== item.key ? function (e) {
                if (e.ctrlKey || e.altKey) {
                  return;
                }
                if (onClickItem) {
                  onClickItem(e, item);
                }
              } : null}
            >
              {fields.map(function (field, index) {
                const renderizableField = getRenderizableField(field, item);
                return (
                  <td key={'value-' + index} className={(field.dispensable ? 'd-none d-' + field.dispensable + '-table-cell ' : '') + 'align-middle'}>
                    <div className={'d-flex align-items-center' + getCssAlignmentCell(field.alignment) + getCssAlignmentTitle(field.alignment)}>
                      <AvatarField size="sm" field={renderizableField} />
                      <ComplexField size="sm" field={renderizableField} />
                    </div>
                  </td>
                );
              })}
              <td key={-1} className="p-0 border-0" />
            </tr>
          ))}
        </tbody>
      </table>
      {current &&
        <ReactBootstrap.Overlay show={true} target={current.target} placement="left">
          <div className="d-flex ps-2 hover" style={{ zIndex: 100000 }}>
            {contextualActions.map((contextualAction, index) =>
              !(contextualAction.hidden && contextualAction.hidden(current.item)) ? (
                <div key={index}>
                  <button className={'d-flex btn-outline-' + (contextualAction.color ?? 'primary') + ' border-0'} onClick={(e) => contextualActionClick(e, contextualAction, current.item)}>
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
          </div>
        </ReactBootstrap.Overlay>
      }
    </div>
  );
}

export default Grid;