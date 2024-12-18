// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const ErrorBox = identity(function () {
  const { i18n, error } = useAppContext();
  const words = getWords(i18n.code);

  const getErrorText = function () {
    if (error) {
      if (error.additionalData) {
        if (error.additionalData.translationKey && words[error.additionalData.translationKey]) {
          return setTextFriendly(words[error.additionalData.translationKey]) + '.';
        }
        else if (error.additionalData.error) {
          return error.additionalData.error;
        }
        else if (error.additionalData.message) {
          return error.additionalData.message;
        }
        else if (error.additionalData.errorMessage) {
          return error.additionalData.errorMessage;
        }
      }
      if (error.message) {
        return error.message;
      }
    }
    return setTextFriendly(words.somethingWentWrong) + '. ' + setTextFriendly(words.weAreOnItAndWillHaveThingsBackToNormalSoon) + '.';
  }
  const setTextFriendly = function (text) {
    const lowerText = text.toLowerCase();
    return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
  }

  if (error === null || error === undefined) {
    return (<div></div>);
  }

  return (
    <div className="wit-error-box">{getErrorText()}</div>
  );
});

export default ErrorBox;