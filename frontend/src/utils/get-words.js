import translationsEn from '../translations/en.json';

export const getWords = function (code) {
  switch (code) {
    case 'En': {
      return translationsEn;
    }
    default: {
      return {};
    }
  }
}

