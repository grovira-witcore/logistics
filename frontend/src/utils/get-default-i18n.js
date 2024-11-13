export function getDefaultI18n() {
  let navigatorLanguage = localStorage.getItem('language');
  if (navigatorLanguage === null || navigatorLanguage === undefined) {
    navigatorLanguage = navigator.language || navigator.userLanguage;
    if (navigatorLanguage && navigatorLanguage.length >= 2) {
      navigatorLanguage = navigatorLanguage.substring(0, 2);
    }
  }
  return {
    code: 'En',
    dateFormat: 'mm/dd/yyyy',
    moneySymbol: '$'
  }
}
