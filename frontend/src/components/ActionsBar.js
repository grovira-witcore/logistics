// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';


const ActionsBar = function ({ actions }) {
  const actionClick = function (e, action) {
    action.onClick(e);
  }

  return (
    <div className="wit-actions-bar d-flex align-items-center">
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
  );
}

export default ActionsBar;