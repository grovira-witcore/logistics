// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import AvatarField from './AvatarField.js';
import ComplexField from './ComplexField.js';
import EditableBox from './EditableBox.js';
import { identity } from '../utils/identity.js';

const Brief = identity(function ({ fieldsDisposition, fieldsSize, fields }) {
  switch (fieldsDisposition) {
    case 'table': {
      return (
        <div className="table-responsive">
          <table className="table">
            <tbody>
              {fields.map((field, index) =>
                (fieldsSize === 'large' ?
                  <tr key={'field-' + index}>
                    <td className="w-auto text-default text-lg fw-bold" style={{ minWidth: 180 }}>
                      {field.label}
                    </td>
                    <td className="w-100">
                      {field.editor ?
                        <EditableBox component={field.editor.component} properties={field.editor.properties} initialValue={field.editor.initialValue} updater={field.editor.updater} alignment="end">
                          <div className="d-flex align-items-center justify-content-end">
                            <AvatarField size="lg" field={field} />
                            <ComplexField size="lg" field={field} />
                          </div>
                        </EditableBox> :
                        <div className="d-flex align-items-center justify-content-end">
                          <AvatarField size="lg" field={field} />
                          <ComplexField size="lg" field={field} />
                        </div>
                      }
                    </td>
                  </tr> :
                  <tr key={'field-' + index}>
                    <td className="w-auto text-default text-sm fw-bold" style={{ minWidth: 180 }}>
                      {field.label}
                    </td>
                    <td className="w-100">
                      {field.editor ?
                        <EditableBox component={field.editor.component} properties={field.editor.properties} initialValue={field.editor.initialValue} updater={field.editor.updater} alignment="end">
                          <div className="d-flex align-items-center justify-content-end">
                            <AvatarField size="sm" field={field} />
                            <ComplexField size="sm" field={field} />
                          </div>
                        </EditableBox> :
                        <div className="d-flex align-items-center justify-content-end">
                          <AvatarField size="sm" field={field} />
                          <ComplexField size="sm" field={field} />
                        </div>
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      );
    }
    case 'sheet': {
      return (
        <div className="wit-brief-sheet">
          {fields.map((field, index) =>
            (fieldsSize === 'large' ?
              <div key={'field-' + index} className="pt-2">
                {field.editor ?
                  <EditableBox component={field.editor.component} properties={field.editor.properties} initialValue={field.editor.initialValue} updater={field.editor.updater} alignment="start">
                    <div className="d-flex align-items-center">
                      <AvatarField size="lg" field={field} />
                      <ComplexField size="lg" field={field} />
                    </div>
                  </EditableBox> :
                  <div className="d-flex align-items-center">
                    <AvatarField size="lg" field={field} />
                    <ComplexField size="lg" field={field} />
                  </div>
                }
              </div> :
              <div key={'field-' + index} className="pt-2">
                {field.editor ?
                  <EditableBox component={field.editor.component} properties={field.editor.properties} initialValue={field.editor.initialValue} updater={field.editor.updater} alignment="start">
                    <div className="d-flex align-items-center">
                      <AvatarField size="sm" field={field} />
                      <ComplexField size="sm" field={field} />
                    </div>
                  </EditableBox> :
                  <div className="d-flex align-items-center">
                    <AvatarField size="sm" field={field} />
                    <ComplexField size="sm" field={field} />
                  </div>
                }
              </div>
            )
          )}
        </div>
      );
    }
    default: {
      let className = null;
      switch (fieldsDisposition) {
        case 'start': {
          className = "wit-brief d-flex flex-wrap";
          break;
        }
        case 'center': {
          className = 'wit-brief d-flex flex-wrap justify-content-center';
          break;
        }
        case 'end': {
          className = 'wit-brief d-flex flex-wrap justify-content-end';
          break;
        }
        case 'spaces-between': {
          className = 'wit-brief d-flex flex-wrap justify-content-between';
          break;
        }
        case 'spaces-around': {
          className = 'wit-brief d-flex flex-wrap justify-content-around';
          break;
        }
        default: {
          className = 'wit-brief-floating d-flex flex-wrap';
          break;
        }
      }
      return (
        <div className={className}>
          {fields.map((field, index) =>
            <div key={'field-' + index}>
              {fieldsSize === 'large' ?
                <div className="d-flex align-items-center">
                  <AvatarField size="lg" field={field} />
                  <div className="fs-2 pt-1">
                    <div className="text-sm text-disabled">{field.label}</div>
                    {field.editor ?
                      <EditableBox component={field.editor.component} properties={field.editor.properties} initialValue={field.editor.initialValue} updater={field.editor.updater} alignment="start">
                        <ComplexField size="lg" field={field} />
                      </EditableBox> :
                      <ComplexField size="lg" field={field} />
                    }
                  </div>
                </div> :
                <div>
                  <div className="text-sm fw-bold">
                    {field.label}
                  </div>
                  <div className="pt-1">
                    {field.editor ?
                      <EditableBox component={field.editor.component} properties={field.editor.properties} initialValue={field.editor.initialValue} updater={field.editor.updater} alignment="start">
                        <div className="d-flex align-items-center">
                          <AvatarField size="sm" field={field} />
                          <ComplexField size="sm" field={field} />
                        </div>
                      </EditableBox> :
                      <div className="d-flex align-items-center">
                        <AvatarField size="sm" field={field} />
                        <ComplexField size="sm" field={field} />
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      );
    }
  }
});

export default Brief;
