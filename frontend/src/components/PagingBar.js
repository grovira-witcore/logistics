// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import IconArrowLeft from './icons/IconArrowLeft.js';
import IconArrowRight from './icons/IconArrowRight.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const PagingBar = identity(function ({ pageNumber, setPageNumber, countOfItems, countOfPages }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const handlePreviousPageClick = function () {
    setPageNumber(pageNumber - 1);
  }
  const handlePageClick = function (targetPageNumber) {
    setPageNumber(targetPageNumber);
  }
  const handleNextPageClick = function () {
    setPageNumber(pageNumber + 1);
  }

  const targetPagesNumbers = [];
  if (countOfPages <= 10) {
    for (let i = 1; i <= countOfPages; i++) {
      targetPagesNumbers.push(i);
    }
  }
  else {
    if ((pageNumber - 5) < 1) {
      for (let i = 1; i <= 10; i++) {
        targetPagesNumbers.push(i);
      }
    }
    else if ((pageNumber + 4) > countOfPages) {
      for (let i = countOfPages - 9; i <= countOfPages; i++) {
        targetPagesNumbers.push(i);
      }
    }
    else {
      for (let i = pageNumber - 5; i <= pageNumber + 4; i++) {
        targetPagesNumbers.push(i);
      }
    }
  }
  if (countOfItems === null || countOfItems === undefined || countOfPages === null || countOfPages === undefined) {
    return (
      <div className="wit-paging-bar d-flex align-items-center">
        {pageNumber > 1 ?
          <button className="wit-paging-icon wit-paging-icon-enabled" onClick={handlePreviousPageClick}>
            <IconArrowLeft/>
          </button> :
          <div className="wit-paging-icon wit-paging-icon-disabled">
            <IconArrowLeft/>
          </div>
        }
        <div className='wit-paging-numbers d-flex align-items-center'>
          <div key={pageNumber} className="wit-paging-number wit-paging-number-active">
            {pageNumber}
          </div>
        </div>
        <button className="wit-paging-icon wit-paging-icon-enabled" onClick={handleNextPageClick}>
          <IconArrowRight/>
        </button>
      </div>
    );
  }
  else {
    if (countOfPages <= 1) {
      return (
        <div className="wit-paging-bar d-flex align-items-center">
          <div className="flex-grow-1" />
          <div className="wit-paging-info d-flex align-items-center">
            <div className="fw-bold">{countOfItems}</div>
            <div>{(countOfItems === 1 ? words.item.toLowerCase() : words.items.toLowerCase()) + ' ' + words.in.toLowerCase() + ' ' + words.total.toLowerCase()}</div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="wit-paging-bar d-flex align-items-center">
          {pageNumber > 1 ?
            <button className="wit-paging-icon wit-paging-icon-enabled" onClick={handlePreviousPageClick}>
              <IconArrowLeft/>
            </button> :
            <div className="wit-paging-icon wit-paging-icon-disabled">
              <IconArrowLeft/>
            </div>
          }
          <div className="wit-paging-numbers d-flex align-items-center">
            {targetPagesNumbers.map((targetPageNumber) =>
              targetPageNumber !== pageNumber ?
                <button key={targetPageNumber} className="wit-paging-number" onClick={(e) => handlePageClick(targetPageNumber)}>
                  {targetPageNumber}
                </button> :
                <div key={targetPageNumber} className="wit-paging-number wit-paging-number-active">
                  {targetPageNumber}
                </div>
            )}
          </div>
          {pageNumber < countOfPages ?
            <button className="wit-paging-icon wit-paging-icon-enabled" onClick={handleNextPageClick}>
              <IconArrowRight/>
            </button> :
            <div className="wit-paging-icon wit-paging-icon-disabled">
              <IconArrowRight/>
            </div>
          }
          <div className="flex-grow-1" />
          <div className="wit-paging-info d-flex align-items-center">
            <div className="fw-bold">{countOfItems}</div>
            <div>{(countOfItems === 1 ? words.item.toLowerCase() : words.items.toLowerCase()) + ' ' + words.in.toLowerCase()}</div>
            <div className="fw-bold">{countOfPages}</div>
            <div>{countOfPages === 1 ? words.page.toLowerCase() : words.pages.toLowerCase()}</div>
          </div>
        </div>
      );
    }
  }
});

export default PagingBar;