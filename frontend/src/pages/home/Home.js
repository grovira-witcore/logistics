import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import HomeTop from './HomeTop.js';

const Home = ReactRouterDOM.withRouter(function () {

  return (
    <div>
      <div className="canvas">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
              <div className="section">
                <div>
                  <HomeTop />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-12 p-0">
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-12 p-0">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Home;
