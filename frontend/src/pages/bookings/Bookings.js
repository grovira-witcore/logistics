import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import BookingsBody from './BookingsBody.js';

const Bookings = ReactRouterDOM.withRouter(function () {

  return (
    <div>
      <div className="canvas">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
              <div className="section">
                <div>
                  <BookingsBody />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Bookings;
