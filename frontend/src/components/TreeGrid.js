// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import AvatarField from './AvatarField.js';
import ComplexField from './ComplexField.js';
import IconExpanded from './icons/IconExpanded.js';
import IconCollapsed from './icons/IconCollapsed.js';
import IconEmpty from './icons/IconEmpty.js';
import { identity } from '../utils/identity.js';


const TreeGrid = identity(function ({ levels, items }) {
  const [current, setCurrent] = React.useState(null);
  const [expandedsCollapseds, setExpandedsCollapseds] = React.useState({});

  const getRenderizableField = function (field, item) {
    const renderizableField = { ...field };
    if (field.visibilityBindIndex !== null && field.visibilityBindIndex !== undefined && !item.data[field.visibilityBindIndex]) {
      renderizableField.value = null;
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

  const handleItemMouseOver = function (e, item, childLevelKey) {
    let currentNode = e.target;
    while (currentNode && currentNode.nodeName !== 'TR') {
      currentNode = currentNode.parentNode;
    }
    if (currentNode) {
      setCurrent({
        item: item,
        childLevelKey: childLevelKey,
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

  const renderItems = function () {
    const organizedItems = {};
    for (const item of items) {
      const parentFullKey = (item.parentLevelKey ?? '') + '|' + (item.parentKey ?? '');
      if (organizedItems[parentFullKey + '|' + item.levelKey] === null || organizedItems[parentFullKey + '|' + item.levelKey] === undefined) {
        organizedItems[parentFullKey + '|' + item.levelKey] = [];
      }
      organizedItems[parentFullKey + '|' + item.levelKey].push(item);
    }
    return renderItemsLevel(organizedItems, 0, 0, null);
  }
  const renderItemsLevel = function (organizedItems, levelIndex, indent, parentItem) {
    const level = levels[levelIndex];
    const parentFullKey = (parentItem ? parentItem.levelKey : '') + '|' + (parentItem ? parentItem.key : '');
    const childLevelsIndexes = [];
    for (let i = 0; i < levels.length; i++) {
      const childLevel = levels[i];
      if (childLevel.parentKey === level.key) {
        childLevelsIndexes.push(i);
      }
    }
    const renders = [];
    if (organizedItems[parentFullKey + '|' + level.key]) {
      for (const item of organizedItems[parentFullKey + '|' + level.key]) {
        const fullKey = item.levelKey + '|' + item.key;
        const hasChildren = childLevelsIndexes.length > 1 || (childLevelsIndexes.length === 1 && organizedItems[fullKey + '|' + levels[childLevelsIndexes[0]].key] && organizedItems[fullKey + '|' + levels[childLevelsIndexes[0]].key].length > 0);
        let expandedOrCollapsed = expandedsCollapseds[fullKey];
        if (expandedOrCollapsed === null || expandedOrCollapsed === undefined) {
          expandedOrCollapsed = level.expanded ? 'expanded' : 'collapsed';
        }
        renders.push(
          <tr
            key={fullKey}
            className={level.selectedKey !== item.key ? (current && current.item.levelKey === item.levelKey && current.item.key === item.key && (current.childLevelKey === null || current.childLevelKey === undefined) ? 'hover' + (hasChildren || level.onClickItem ? ' cursor-pointer' : '') : '') : 'current'}
            onMouseOver={level.selectedKey !== item.key ? (e) => handleItemMouseOver(e, item) : null}
            onFocus={() => null}
            onClick={level.selectedKey !== item.key ? function (e) {
              if (e.ctrlKey || e.altKey) {
                return;
              }
              if (hasChildren) {
                if (expandedOrCollapsed === 'expanded') {
                  setExpandedsCollapseds({ ...expandedsCollapseds, [fullKey]: 'collapsed' });
                }
                else {
                  setExpandedsCollapseds({ ...expandedsCollapseds, [fullKey]: 'expanded' });
                }
              }
              else if (level.onClickItem) {
                level.onClickItem(e, item);
              }
            } : null}
           
          >
            {levels[levelIndex].fields.map(function (field, index) {
              const renderizableField = getRenderizableField(field, item);
              if (index === 0) {
                return (
                  <td key={'field-' + index} className="d-flex align-middle text-start icon-sm">
                    <div style={{ width: (indent * 18) + 'px' }} />
                    {hasChildren ?
                      (expandedOrCollapsed === 'expanded' ? <IconExpanded/> : <IconCollapsed/>) :
                      <IconEmpty/>
                    }
                    <div className="ps-1">
                      <div className="d-flex align-items-center">
                        <AvatarField size="sm" field={renderizableField} />
                        <ComplexField size="sm" field={renderizableField} />
                      </div>
                    </div>
                  </td>
                );
              }
              else {
                const field0 = levels[0].fields[index];
                return (
                  <td key={'field-' + index} className={(field0.breakpoint ? 'd-none d-' + field0.breakpoint + '-table-cell ' : '') + 'align-middle'}>
                    <div className={'d-flex align-items-center' + getCssAlignmentCell(field.alignment)}>
                      <AvatarField size="sm" field={renderizableField} />
                      <ComplexField size="sm" field={renderizableField} />
                    </div>
                  </td>
                );
              }
            })}
            <td key={-1} className="p-0 border-0" />
          </tr>
        )
        if (expandedOrCollapsed === 'expanded') {
          if (childLevelsIndexes.length === 1) {
            renders.push(...renderItemsLevel(organizedItems, childLevelsIndexes[0], indent + 1, item));
          }
          else if (childLevelsIndexes.length > 1) {
            for (const childLevelIndex of childLevelsIndexes) {
              renders.push(...renderItemsTitledLevel(organizedItems, childLevelIndex, indent + 1, item));
            }
          }
        }
      }
    }
    return renders;
  }
  const renderItemsTitledLevel = function (organizedItems, levelIndex, indent, parentItem) {
    const level = levels[levelIndex];
    const parentFullKey = (parentItem ? parentItem.levelKey : '') + '|' + (parentItem ? parentItem.key : '');
    const hasChildren = organizedItems[parentFullKey + '|' + level.key] && organizedItems[parentFullKey + '|' + level.key].length > 0;
    let expandedOrCollapsed = expandedsCollapseds[parentFullKey + '|' + level.key];
    if (expandedOrCollapsed === null || expandedOrCollapsed === undefined) {
      expandedOrCollapsed = level.titleExpanded ? 'expanded' : 'collapsed';
    }
    const renders = [];
    renders.push(
      <tr
        key={parentFullKey + '|' + level.key}
        className={(current && current.item.levelKey === parentItem.levelKey && current.item.key === parentItem.key && current.childLevelKey === level.key ? 'hover' + (hasChildren ? ' cursor-pointer' : '') : '')}
        onMouseOver={(e) => handleItemMouseOver(e, parentItem, level.key)}
        onFocus={() => null}
        onClick={function (e) {
          if (e.ctrlKey || e.altKey) {
            return;
          }
          if (hasChildren) {
            if (expandedOrCollapsed === 'expanded') {
              setExpandedsCollapseds({ ...expandedsCollapseds, [parentFullKey + '|' + level.key]: 'collapsed' });
            }
            else {
              setExpandedsCollapseds({ ...expandedsCollapseds, [parentFullKey + '|' + level.key]: 'expanded' });
            }
          }
        }}
       
      >
        {levels[levelIndex].fields.map(function (field, index) {
          if (index === 0) {
            return (
              <td key={'field-' + index} className="d-flex align-middle icon-sm">
                <div style={{ width: (indent * 18) + 'px' }} />
                {hasChildren ?
                  (expandedOrCollapsed === 'expanded' ? <IconExpanded/> : <IconCollapsed/>) :
                  <IconEmpty/>
                }
                <div className="ps-1 icon-sm">
                  {React.createElement(field.icon)}
                </div>
                <div className="ps-1 fw-bold">
                  {level.label}
                </div>
              </td>
            );
          }
          else {
            const field0 = levels[0].fields[index];
            return (
              <td key={'field-' + index} className={(field0.breakpoint ? 'd-none d-' + field0.breakpoint + '-table-cell' : '')}>
              </td>
            );
          }
        })}
      </tr>
    )
    if (expandedOrCollapsed === 'expanded') {
      renders.push(...renderItemsLevel(organizedItems, levelIndex, indent + 1, parentItem));
    }
    return renders;
  }

  let currentLevel = null;
  if (current && (current.childLevelKey === null || current.childLevelKey === undefined)) {
    currentLevel = levels.find((levelX) => levelX.key === current.item.levelKey);
  }
  return (
    <div className="table-responsive" role="region" onMouseLeave={() => setCurrent(null)}>
      <table className="table">
        <thead>
          <tr
            onMouseOver={() => setCurrent(null)}
            onFocus={() => null}
           
          >
            {levels[0].fields.map(function (field, index) {
              return (
                <th key={'field-' + index} className={(field.breakpoint ? 'd-none d-' + field.breakpoint + '-table-cell' : '') + getCssAlignmentTitle(field.alignment)}>
                  <span className="text-lg text-default">{field.label}</span>
                </th>
              );
            })}
            <th className="p-0 border-0" />
          </tr>
        </thead>
        <tbody>
          {renderItems()}
        </tbody>
      </table>
      {current && currentLevel &&
        <ReactBootstrap.Overlay show={true} target={current.target} placement="left">
          <div className="d-flex ps-2 hover" style={{ zIndex: 100000 }}>
            {currentLevel.contextualActions.map((contextualAction, index) =>
              !(contextualAction.hidden && contextualAction.hidden(current.item)) ? (
                <div key={'contextual-action-' + index}>
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
});

export default TreeGrid;