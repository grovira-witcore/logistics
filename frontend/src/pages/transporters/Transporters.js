import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import TransportersBody from './TransportersBody.js';

const Transporters = ReactRouterDOM.withRouter(function () {

  return (
    <div>
      <div className="canvas">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
              <div className="section">
                <div>
                  <TransportersBody />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Transporters;
