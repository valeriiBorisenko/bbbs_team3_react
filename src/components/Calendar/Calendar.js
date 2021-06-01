/* eslint-disable no-multiple-empty-lines */
//! выкинуть правило линта потом

import React from 'react';
import PropTypes from 'prop-types';
import TitleH1 from '../ui/TitleH1/TitleH1';
import ButtonTags from '../ui/Button/ButtonTags';
import './Calendar.scss';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
// import { MonthData } from '../../utils/constants';

function Calendar({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  clickButton,
  isSelected, //! завязать на isBooked
  dataCalendar,
  isBooked
}) {
  // console.log('dataCalendar', dataCalendar);

  const months = [
    'январь', // 0
    'февраль', // 1
    'март', // 2
    'апрель', // 3
    'май', // 4
    'июнь', // 5
    'июль', // 6
    'август', // 7
    'сентябрь', // 8
    'октябрь', // 9
    'ноябрь', // 10
    'декабрь' // 11
  ];

  //! определяем меняется ли год в череде ивентов
  // const [isYearChanging, setIsYearChanging] = React.useState(false);

  // const currentYear = new Date().getFullYear();
  // // console.log('currentYear', currentYear);

  // const arrayOfYearsWithEvents = arrayOfSortedEvents.map((someEvent) => {
  //   const dateObj = new Date(someEvent.startAt);
  //   const year = dateObj.getFullYear();
  //   return year;
  // });
  // console.log('arrayOfYearsWithEvents', arrayOfYearsWithEvents);

  // const setOfUniqueYears = new Set(arrayOfYearsWithEvents);
  // const arrayOfUniqueYears = Array.from(setOfUniqueYears);

  // React.useEffect(() => {
  //   setIsYearChanging(() => arrayOfUniqueYears.some((year) => !(year === currentYear)));
  // });
  // console.log('isYearChanging', isYearChanging);

  //! фильтрация ивентов при нажатии на тагс
  function handleFiltration(monthName) {
    console.log('tyt');
    console.log('monthName', monthName);
    // надо из ивента подставить год и месяц ивента
    // const min = new Date(this._year, this._monthNumber);
    // const max = new Date(this._year, this._monthNumber + 1);
  }

  // [0 10 11]
  // январь ноябрь декабрь
  // [11 10 0]
  // декабрь ноябрь январь

  // console.log(dataCalendar);
  //! новая попытка утро 01.06
  // массив тасков отсортирован по дате возрастания сразу же
  //! все ивенты отсортированы по хронологии
  const arrayOfSortedEvents = dataCalendar.sort((a, b) => {
    const date1 = new Date(a.startAt);
    const date2 = new Date(b.startAt);
    return date1 - date2;
  });
  console.log('NEW arrayOfSortedEvents', arrayOfSortedEvents);

  //! счетчик (не актуален)
  // let counter = 0;
  // const currentYear = new Date().getFullYear();
  // for (let i = 1; i < arrayOfSortedEvents.length; i += 1) {
  //   const monthOfPreviousItem = new Date(arrayOfSortedEvents[i - 1].startAt).getMonth();
  //   const monthOfCurrentItem = new Date(arrayOfSortedEvents[i].startAt).getMonth();

  //   // const yearOfPreviousItem = new Date(arrayOfSortedEvents[i - 1].startAt).getFullYear();
  //   const yearOfCurrentItem = new Date(arrayOfSortedEvents[i].startAt).getFullYear();

  //   const isMonthChanged = monthOfCurrentItem !== monthOfPreviousItem;
  //   const isYearChanged = yearOfCurrentItem !== currentYear;

  //   if (isMonthChanged && isYearChanged) {
  //     counter += 1;
  //   }
  // }
  // console.log('counter', counter);



  const arrayOfYearsWithEvents = arrayOfSortedEvents.map((someEvent) => {
    const dateObj = new Date(someEvent.startAt);
    const year = dateObj.getFullYear();
    return year;
  });
  console.log('arrayOfYearsWithEvents', arrayOfYearsWithEvents);







  //! начинаем сбор тагсов-кнопок
  const arrayOfAllMonthsWithEvents = arrayOfSortedEvents.map((someEvent) => {
    // взяли дату ивента, переделали в дату-объект
    const dateObj = new Date(someEvent.startAt);
    const month = dateObj.getMonth();
    return month;
  });
  console.log('arrayOfAllMonthsWithEvents', arrayOfAllMonthsWithEvents);

  // СЕТ С НОМЕРАМИ МЕСЯЦЕВ
  const setOfUniqueMonths = new Set(arrayOfAllMonthsWithEvents);
  // УНИКАЛЬНЫЙ массив месяцев на которые есть таски
  const arrayOfUniqueMonths = Array.from(setOfUniqueMonths);
  const arrayOfUniqueMonthsNames = arrayOfUniqueMonths.map((monthNumber) => months[monthNumber]);
  console.log('arrayOfUniqueMonthsNames', arrayOfUniqueMonthsNames);

  // arrayOfUniqueMonths.sort();
  console.log('arrayOfUniqueMonths', arrayOfUniqueMonths);

  // кнопки конкретных месяцев
  const filtrationButtonsToRender = arrayOfUniqueMonths.map((number) => {
    // console.log(months[number]);
    // console.log(months.indexOf(months[number]));
    const key = months.indexOf(months[number]);
    const tagTitle = months[number];

    return (
      <li className="tags__list-item" key={key}>
        <ButtonTags
          title={tagTitle}
          color="black"
          enableFiltation={handleFiltration}
        />
      </li>
    );
  });
  // console.log('filtrationButtonsToRender', filtrationButtonsToRender);

  return dataCalendar ? (
    <section className="lead page__section fade-in">
      <TitleH1 title="Календарь" />
      <div className="tags">
        <ul className="tags__list">
          {filtrationButtonsToRender}
        </ul>
      </div>
      <section className="calendar-container">
        {dataCalendar.map((data) => (
          <CardCalendar
            key={data.id}
            data={data}
            onEventSignUpClick={onEventSignUpClick}
            onEventFullDescriptionClick={onEventFullDescriptionClick}
            clickButton={clickButton}
            isSelected={isSelected} //! завязать на isBooked
            isBooked={isBooked} //! выкинуть
          />
        ))}
      </section>
    </section>
  ) : (
    <p style={{ color: 'red', margin: '0 auto', textAlign: 'center' }}>Loading</p>
  );
}

Calendar.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  clickButton: PropTypes.func,
  isSelected: PropTypes.bool,
  dataCalendar: PropTypes.arrayOf(PropTypes.object),
  isBooked: PropTypes.bool
};

Calendar.defaultProps = {
  onEventSignUpClick: undefined,
  onEventFullDescriptionClick: undefined,
  clickButton: undefined,
  isSelected: false,
  dataCalendar: [],
  isBooked: false
};

export default Calendar;
