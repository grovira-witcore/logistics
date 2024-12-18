// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import IconArrowLeft from './icons/IconArrowLeft.js';
import IconArrowRight from './icons/IconArrowRight.js';
import { identity } from '../utils/identity.js';
import { getWords } from '../utils/get-words.js';

const DatePicker = identity(function ({ value, onChange }) {
  const { i18n } = useAppContext();
  const words = getWords(i18n.code);

  const [calendarPointer, setCalendarPointer] = React.useState(null);
  const [currentCalendarItem, setCurrentCalendarItem] = React.useState(null);
  const [nowCalendarItem, setNowCalendarItem] = React.useState(null);

  React.useEffect(() => {
    if (value !== null && value !== undefined && value !== '') {
      const date = new Date(value);
      setCalendarPointer({ year: date.getFullYear(), month: date.getMonth() + 1 });
      setCurrentCalendarItem({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
    }
    else {
      const date = new Date();
      setCalendarPointer({ year: date.getFullYear(), month: date.getMonth() + 1 });
      setCurrentCalendarItem(null);
    }
    const now = new Date();
    setNowCalendarItem({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
  }, [value]);

  const handlePreviousMonthClick = function (e) {
    const newCalendarPointer = { year: calendarPointer.year, month: calendarPointer.month - 1 };
    if (newCalendarPointer.month === 0) {
      newCalendarPointer.year--;
      newCalendarPointer.month = 12;
    }
    setCalendarPointer(newCalendarPointer);
  }
  const handleNextMonthClick = function (e) {
    const newCalendarPointer = { year: calendarPointer.year, month: calendarPointer.month + 1 };
    if (newCalendarPointer.month === 13) {
      newCalendarPointer.year++;
      newCalendarPointer.month = 1;
    }
    setCalendarPointer(newCalendarPointer);
  }
  const handleCalendarItemClick = function (e, calendarItem) {
    onChange(new Date(calendarItem.year, calendarItem.month - 1, calendarItem.day).toISOString());
  }

  const getMonthText = function (month) {
    switch (month) {
      case 1: {
        return words.january;
      }
      case 2: {
        return words.february;
      }
      case 3: {
        return words.march;
      }
      case 4: {
        return words.april;
      }
      case 5: {
        return words.may;
      }
      case 6: {
        return words.june;
      }
      case 7: {
        return words.july;
      }
      case 8: {
        return words.august;
      }
      case 9: {
        return words.september;
      }
      case 10: {
        return words.october;
      }
      case 11: {
        return words.november;
      }
      case 12: {
        return words.december;
      }
    }
    return '';
  }
  const getCalendarItems = function (year, month) {
    const calendarItems = [];
    const firstWeekDayOfMonth = getFirstWeekDayOfMonth(year, month);
    if (firstWeekDayOfMonth > 0) {
      const lastDayInPreviusMonth = getDaysInMonth(year, month - 1);
      for (let dayInPreviousMonth = lastDayInPreviusMonth - firstWeekDayOfMonth + 1; dayInPreviousMonth <= lastDayInPreviusMonth; dayInPreviousMonth++) {
        calendarItems.push({ year: year, month: month - 1, day: dayInPreviousMonth });
      }
    }
    const lastDayInCurrentMonth = getDaysInMonth(year, month);
    for (let dayInCurrentMonth = 1; dayInCurrentMonth <= lastDayInCurrentMonth; dayInCurrentMonth++) {
      calendarItems.push({ year: year, month: month, day: dayInCurrentMonth });
    }
    let dayInNextMonth = 1;
    while (calendarItems.length < 42) {
      calendarItems.push({ year: year, month: month + 1, day: dayInNextMonth });
      dayInNextMonth++;
    }
    return calendarItems;
  }
  const getFirstWeekDayOfMonth = function (year, month) {
    return new Date(year, month - 1, 1).getDay();
  }
  const getDaysInMonth = function (year, month) {
    return new Date(year, month, 0).getDate();
  }
  const equalCalendarItems = function (calendarItem1, calendarItem2) {
    return calendarItem1 && calendarItem2 && 
      calendarItem1.year === calendarItem2.year && 
      calendarItem1.month === calendarItem2.month && 
      calendarItem1.day === calendarItem2.day;
  }

  if (calendarPointer === null || calendarPointer === undefined) {
    return (<div></div>);
  }
  const calendarItems = getCalendarItems(calendarPointer.year, calendarPointer.month);
  return (
    <div className="wit-date-picker">
      <div className="d-flex align-items-center">
        <button onMouseDown={(e) => e.preventDefault()} onClick={handlePreviousMonthClick}><IconArrowLeft/></button>
        <div className="flex-grow-1 text-center">{getMonthText(calendarPointer.month) + ' ' + calendarPointer.year}</div>
        <button onMouseDown={(e) => e.preventDefault()} onClick={handleNextMonthClick}><IconArrowRight /></button>
      </div>
      <table className="table table-borderless">
        <thead className="border-bottom">
          <tr>
            {[words.sunday, words.monday, words.tuesday, words.wednesday, words.thursday, words.friday, words.saturday].map(function (weekDayText, index) {
              return (
                <td key={'day-' + index} className="wit-date-picker-day-column text-center">
                  {weekDayText.substring(0, 2)}
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map(function (i) {
            return (
              <tr key={i}>
                {[1, 2, 3, 4, 5, 6, 7].map(function (j) {
                  const calendarItem = calendarItems[((i - 1) * 7) + (j - 1)];
                  return (
                    <td key={j} className="wit-date-picker-day-area">
                      <button className={'wit-date-picker-day-value' + (equalCalendarItems(currentCalendarItem, calendarItem) ? ' wit-date-picker-day-value-selected' : '') + (equalCalendarItems(nowCalendarItem, calendarItem) ? ' fw-bold' : (calendarItem.month !== calendarPointer.month ? ' text-gray' : '')) + ' text-center'} onMouseDown={(e) => e.preventDefault()} onClick={(e) => handleCalendarItemClick(e, calendarItem)}>
                        {calendarItem.day}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default DatePicker;