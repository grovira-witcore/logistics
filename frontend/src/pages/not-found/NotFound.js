// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import { getWords } from '../../utils/get-words.js';

const NotFound = function () {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const history = ReactRouterDOM.useHistory();

  const setTextFriendly = function (text) {
    const lowerText = text.toLowerCase();
    return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
  }

  const handleBackToHome = function (e) {
    history.push('/');
  }

  return (
    <div className="container">
      <div className="row" style={{ padding: '40px', width: '100%' }}>
        <div className="col-6 text-center text-default" style={{ paddingTop: '20px' }}>
          <div style={{ fontFamily: 'Inter-Bold', fontSize: '80px', color: '#F25949' }}>OOPS!</div>
          <div style={{ paddingTop: '10px', fontFamily: 'Inter-Bold', fontSize: '20px' }}>{words.pageNotFound + '! ' + setTextFriendly(words.itIsLikeTryingToFindAHiddenTreasure) + '. ' + setTextFriendly(words.navigateBackToTheHomepageAndSetANewCourse) + '.'}</div>
          <div style={{ paddingTop: '20px', fontFamily: 'Inter-Regular', fontSize: '20px' }}>{words.errorCode + ': 404'}</div>
          <div style={{ paddingTop: '20px' }}>
            <button className="btn-primary" onClick={handleBackToHome}>
              {words.backToHome}
            </button>
          </div>
        </div>
        <div className="col-6 text-center">
          <svg viewBox="0 0 32 32" width="300px" height="300px">
            <g>
              <path fill="#F25949" d="M23.578,26v-9.001c0-4.179-3.399-7.578-7.578-7.578s-7.578,3.399-7.578,7.578V26H23.578z M16,14.92   c-1.146,0-2.078,0.932-2.078,2.078c0,0.552-0.448,1-1,1s-1-0.447-1-1c0-2.249,1.83-4.078,4.078-4.078c0.552,0,1,0.448,1,1   S16.552,14.92,16,14.92z" />
              <path fill="#FFFFFF" d="M16,12.92c-2.249,0-4.078,1.83-4.078,4.078c0,0.552,0.448,1,1,1s1-0.447,1-1c0-1.146,0.932-2.078,2.078-2.078   c0.552,0,1-0.448,1-1S16.552,12.92,16,12.92z" />
              <path fill="#8B9CA5" d="M25,26h-1.422H8.422H7c-0.552,0-1,0.447-1,1s0.448,1,1,1h18c0.553,0,1-0.447,1-1S25.553,26,25,26z" />
              <path fill="#FBC34E" d="M16,8.551c0.552,0,1-0.448,1-1V5c0-0.552-0.448-1-1-1s-1,0.448-1,1v2.551C15,8.103,15.448,8.551,16,8.551z" />
              <path fill="#FBC34E" d="M29,17.231h-2.506c-0.553,0-1,0.447-1,1s0.447,1,1,1H29c0.553,0,1-0.447,1-1S29.553,17.231,29,17.231z" />
              <path fill="#FBC34E" d="M6.506,18.231c0-0.553-0.448-1-1-1H3c-0.552,0-1,0.447-1,1s0.448,1,1,1h2.506   C6.058,19.231,6.506,18.784,6.506,18.231z" />
              <path fill="#FBC34E" d="M7.866,11.38c0.196,0.199,0.455,0.299,0.713,0.299c0.253,0,0.506-0.095,0.701-0.287   c0.394-0.387,0.4-1.02,0.013-1.414L7.521,8.175C7.133,7.78,6.5,7.775,6.107,8.162c-0.394,0.387-0.4,1.02-0.013,1.414L7.866,11.38z" />
              <path fill="#FBC34E" d="M23.42,11.679c0.259,0,0.518-0.1,0.713-0.299l1.772-1.804c0.388-0.394,0.382-1.027-0.012-1.414   c-0.396-0.387-1.028-0.382-1.414,0.013l-1.772,1.804c-0.388,0.394-0.382,1.027,0.012,1.414   C22.914,11.584,23.167,11.679,23.42,11.679z" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default NotFound;