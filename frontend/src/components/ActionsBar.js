// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { identity } from '../utils/identity.js';

import IconThreeDots from './icons/IconThreeDots.js';

const ActionsBar = identity(function ({ actions }) {
  const refInput = React.useRef(null);
  const refTarget = React.useRef(null);

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (refTarget && refTarget.current && !refTarget.current.contains(e.target)) {
      setShow(false);
    }
  };

  const actionClick = function (e, action) {
    setShow(false);
    action.onClick(e);
  }

  return (
    <div>
      <div className="wit-actions-bar d-flex align-items-center flex-wrap justify-content-end">
        {actions.map((action, index) =>
          !action.hidden ? (
            !action.disabled ?
              <div key={'action-' + index}>
                <button className={'btn-' + (action.color ?? 'primary')} onClick={(e) => actionClick(e, action)}>
                  {action.label}
                </button>
              </div> :
              <div key={'action-' + index}>
                <div className="btn-disabled">
                  {action.label}
                </div>
              </div>
          ) : null
        )}
      </div>
      <div className="wit-actions-bar-small d-flex align-items-center flex-wrap justify-content-end">
        {actions.some(action => !action.hidden) ?
          <div>
            <button ref={refInput} className="wit-actions-bar-three-dots d-flex align-items-center" onClick={() => setShow(true)}>
              <IconThreeDots />
            </button>
            {show &&
              <ReactBootstrap.Overlay ref={refTarget} show={true} target={refInput.current} placement="bottom-start" onHide={(e) => setShow(false)}>
                <div className="wit-actions-bar-three-dots-dd" style={{ zIndex: 100000 }}>
                  {actions.map((action, index) =>
                    !action.hidden ? (
                      !action.disabled ?
                        <div key={'action-' + index}>
                          <button className="d-flex align-items-center" onMouseDown={(e) => e.preventDefault()} onClick={(e) => actionClick(e, action)}>
                            {action.label}
                          </button>
                        </div> :
                        <div key={'action-' + index}>
                          <div className="d-flex align-items-center color-disabled">
                            {action.label}
                          </div>
                        </div>
                    ) : null
                  )}
                </div>
              </ReactBootstrap.Overlay>
            }
          </div> :
          null
        }
      </div>
    </div>
  );
});

export default ActionsBar;