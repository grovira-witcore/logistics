// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

export function format(value, type, { formatter, words, dateFormat, moneySymbol }) {
  if (value !== null && value !== undefined) {
    switch (type) {
      case 'integer': {
        if (formatter === 'millions') {
          return formatNumber(value / 1000000, 0) + ' M';
        }
        else if (formatter === 'thousands') {
          return formatNumber(value / 1000, 0) + ' K';
        }
        else {
          return formatNumber(value, 0);
        }
      }
      case 'decimal': {
        if (formatter === 'millions') {
          return formatNumber(value / 1000000, 0) + ' M';
        }
        else if (formatter === 'thousands') {
          return formatNumber(value / 1000, 0) + ' K';
        }
        else {
          return formatNumber(value, 2);
        }
      }
      case 'money': {
        if (formatter === 'millions') {
          return moneySymbol + ' ' + formatNumber(value / 1000000, 0) + ' M';
        }
        else if (formatter === 'thousands') {
          return moneySymbol + ' ' + formatNumber(value / 1000, 0) + ' K';
        }
        else {
          return moneySymbol + ' ' + formatNumber(value, 2);
        }
      }
      case 'percentage': {
        return formatNumber(value * 100, 2) + ' %';
      }
      case 'datetime': {
        if (formatter === 'relative-time') {
          const date = new Date(value);
          const now = new Date()
          const diffInMilliseconds = date - now;
          const diffInMinutes = Math.round(diffInMilliseconds / 60000);
          const diffInHours = Math.round(diffInMilliseconds / 3600000);
          if (diffInMinutes === 0) {
            return words['now'];
          }
          if (diffInMinutes === 1) {
            return words['inOneMinute'];
          }
          if (diffInMinutes > 1 && diffInMinutes < 60) {
            return words['inFewMinutes'].replace('{0}', diffInMinutes);
          }
          if (diffInMinutes === -1) {
            return words['oneMinuteAgo'];
          }
          if (diffInMinutes < -1 && diffInMinutes > -60) {
            return words['fewMinutesAgo'].replace('{0}', Math.abs(diffInMinutes));
          }
          if (diffInHours === 1) {
            return words['inOneHour'];
          }
          if (diffInHours > 1 && diffInHours < 60) {
            return words['inFewHours'].replace('{0}', diffInHours);
          }
          if (diffInHours === -1) {
            return words['oneHourAgo'];
          }
          if (diffInHours < -1 && diffInHours > -60) {
            return words['fewHoursAgo'].replace('{0}', Math.abs(diffInHours));
          }
          if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
            return words['Today'] + ' ' + formatTime(value);
          }
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          if (date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate()) {
            return words['Tomorrow'] + ' ' + formatTime(value);
          }
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          if (date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()) {
            return words['Yesterday'] + ' ' + formatTime(value);
          }
        }
        return formatDatetime(value, dateFormat);
      }
      case 'date': {
        if (formatter === 'relative-time') {
          const date = new Date(value);
          const now = new Date()
          if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
            return words['Today'];
          }
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          if (date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate()) {
            return words['Tomorrow'];
          }
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          if (date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()) {
            return words['Yesterday'];
          }
        }
        return formatDate(value, dateFormat);
      }
      default: {
        return value;
      }
    }
  }
  else {
    return '';
  }
}

export function formatNumber(number, decimals) {
  const parts = number.toFixed(decimals).toString().split('.');
  if (decimals > 0) {
    if (parts.length === 1) {
      return (parts[0] + '.').padEnd(decimals, '0');
    }
    else {
      return (parts[0] + '.' + parts[1]).padEnd(decimals - parts[1].length, '0');
    }
  }
  else {
    return parts[0];
  }
}

export function formatDate(dateIso8601, dateFormat) {
  const date = new Date(dateIso8601);
  const yearPart = date.getFullYear().toString();
  const monthPart = (date.getMonth() + 1).toString().padStart(2, '0');
  const dayPart = (date.getDate()).toString().padStart(2, '0');
  return dateFormat.replace('yyyy', yearPart).replace('mm', monthPart).replace('dd', dayPart);
}

export function formatTime(dateIso8601) {
  const date = new Date(dateIso8601);
  let hour = date.getHours();
  let isAm = true;
  if (hour === 0) {
    hour = 12;
  }
  else if (hour >= 12) {
    if (hour > 12) {
      hour -= 12;
    }
    isAm = false;
  }
  const hourPart = hour.toString().padStart(2, '0');
  const minutesPart = (date.getMinutes()).toString().padStart(2, '0');
  const amPmPart = (isAm ? 'AM' : 'PM');
  return `${hourPart}:${minutesPart} ${amPmPart}`;
}

export function formatDatetime(dateIso8601, dateFormat) {
  return formatDate(dateIso8601, dateFormat) + ' ' + formatTime(dateIso8601);
}
