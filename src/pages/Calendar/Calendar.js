/* eslint-disable no-unused-vars */
import './Calendar.scss';
import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import {
  CurrentUserContext,
  useSmoothScrollOnWindow,
  months,
  BasePage,
  TitleH1,
  CardCalendar,
  Loader,
  renderFilterTags,
  changeRadioTagState
} from './index';
import { changeCaseOfFirstLetter } from '../../utils/utils';

function Calendar({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  dataCalendar,
  onOpenLoginPopup
}) {
  console.log('запуск функции Calendar');
  useSmoothScrollOnWindow({ top: 0 });
  const currentUser = useContext(CurrentUserContext);

  function eventSignUpHandler(cardData) {
    onEventSignUpClick(cardData, cardData.booked);
  }

  // весь список доступных фильтров
  const [filters, setFilters] = useState([]);

  // текущие выбранные настройки фильтрации
  const [activeFilter, setActiveFilter] = useState(null);

  // флаг использования фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // мутабельный массив для применения фильтров (отсортированный)
  const [sortedArray, setSortedArray] = useState([]);

  // массив отфильтрованных ивентов под нажатый фильтр, готовый к отрисовке
  const [filteredCardData, setFilteredCardData] = useState([]);

  const handleFilterClick = (filter, inputName, isChecked) => {
    console.group('handleFilterClick');
    console.log('filter', filter);
    console.log('inputName', inputName);
    console.log('isChecked', isChecked);
    console.groupEnd();
    setIsFiltersUsed(true);
    setActiveFilter(filter);
    changeRadioTagState(setFilters, { inputName, isChecked });
  };

  //! первый useEffect, установка отсортированного массива
  useEffect(() => {
    console.group('запуск первого useEffect');
    console.log('dataCalendar', dataCalendar);
    console.groupEnd();
    const arrayOfSortedEvent = [...dataCalendar].sort((a, b) => {
      const date1 = new Date(a.startAt);
      const date2 = new Date(b.startAt);
      return date1 - date2;
    });

    setSortedArray(arrayOfSortedEvent);
  }, [dataCalendar]);
  // console.log(sortedArray);

  //! второй useEffect, сбор списка фильтров
  useEffect(() => {
    console.group('запуск второго useEffect');
    //* ШАГ 2 из массива отсоритрованных ивентов делаем массив объектов {месяц, год} на каждый ивент
    const arrayOfDatesWithEvents = sortedArray.map((someEvent) => {
      // взяли дату ивента, переделали в дату-объект
      const dateObj = new Date(someEvent.startAt);
      const month = dateObj.getMonth();
      const year = dateObj.getFullYear();
      // в массив вернулся НОМЕР месяца и ГОД
      return { month, year };
    });

    //* ШАГ 3 выкидываем из массива arrayOfDatesWithEvent повторы
    const arrayOfUniqueDates = arrayOfDatesWithEvents.filter((item, index, self) => {
      const something = self
        .findIndex((current) => (item.month === current.month && item.year === current.year));
      return something === index;
    });

    //* ШАГ 4 хронологические, уникальные фильтры, готовые к рендерингу в тагс-кнопки
    const finallArrayOfTagsData = arrayOfUniqueDates.map((filter) => {
      const name = changeCaseOfFirstLetter(months[filter.month]);
      return {
        filter,
        name,
        isActive: false
      };
    });
    console.log('finalTagsData', finallArrayOfTagsData);
    console.groupEnd();

    setFilters(finallArrayOfTagsData);
  }, [sortedArray]);

  //! третий useEffect, фильтрация при нажатии
  useEffect(() => {
    console.group('третий useEffect');
    if (activeFilter) {
      const { year, month } = activeFilter;

      const min = new Date(year, month);
      const max = new Date(year, month + 1);
      const filteredArrayOfEvents = sortedArray.filter((eventItem) => {
        const date = new Date(eventItem.startAt);
        return date >= min && date <= max;
      });
      console.log('filteredArrayOfEvents', filteredArrayOfEvents);

      setFilteredCardData(filteredArrayOfEvents);
      // setIsFiltersUsed(false);
      setActiveFilter(null);
    }
    console.groupEnd();
    // activeFilter
  }, [activeFilter]);

  const whatDataToRender = isFiltersUsed ? filteredCardData : sortedArray;

  return (
    <BasePage>
      <Helmet>
        <title>Календарь</title>
        <meta name="description" content="Календарь событий и мероприятий для наставников" />
      </Helmet>
      <section className="calendar-page page__section fade-in">
        <TitleH1 title="Календарь" />

        {dataCalendar.length > 0 ? (
          <div className="calendar-page__container">
            {filters.length > 1 && (
            <div className="tags fade-in">
              <ul className="tags__list">
                {renderFilterTags(filters, 'checkbox', handleFilterClick)}
              </ul>
            </div>
            )}

            <div className="calendar-page__grid">
              {whatDataToRender.map((data) => (
                <CardCalendar
                  key={data.id}
                  cardData={data}
                  onEventSignUpClick={eventSignUpHandler}
                  onEventFullDescriptionClick={onEventFullDescriptionClick}
                  sectionClass="fade-in"
                />
              ))}
            </div>
          </div>
        ) : <Loader isNested />}

        { !currentUser && onOpenLoginPopup()}
      </section>
    </BasePage>
  );
}
Calendar.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  dataCalendar: PropTypes.arrayOf(PropTypes.object),
  onOpenLoginPopup: PropTypes.func
};

Calendar.defaultProps = {
  onEventSignUpClick: () => {},
  dataCalendar: [],
  onEventFullDescriptionClick: () => {},
  onOpenLoginPopup: () => {}
};

export default Calendar;

//! все что было раньше
//! ШАГ 1 = сортируем все ивенты по хронологии
// const arrayOfSortedEvents = [...dataCalendar].sort((a, b) => {
//   const date1 = new Date(a.startAt);
//   const date2 = new Date(b.startAt);
//   return date1 - date2;
// });
// console.log('dataCalendar', dataCalendar);
// console.log('arrayOfSortedEvents', arrayOfSortedEvents);
// const arrayOfSortedEvents = dataCalendar.sort((a, b) => {
//   const date1 = new Date(a.startAt);
//   const date2 = new Date(b.startAt);
//   return date1 - date2;
// });

//! фильтрация ивентов под нажатый фильтр
// useEffect(() => {
//   if (filterSettings) {
//     const { year, monthNumber } = filterSettings;
//     const min = new Date(year, monthNumber);
//     const max = new Date(year, monthNumber + 1);
//     const filteredArrayOfEvents = arrayOfSortedEvents.filter((eventItem) => {
//       const date = new Date(eventItem.startAt);

//       return date >= min && date <= max;
//     });
//     setFilteredCardData(filteredArrayOfEvents);
//   }

// //   setIsFiltersUsed(isChecked);
// // }, [isChecked, arrayOfSortedEvents, filterSettings]);
// }, [arrayOfSortedEvents, filterSettings]);

// function handleCheckboxChange(evt, filters) {
//   const { target } = evt;
//   setIsChecked(target.checked);
//   setFilterSettings(filters);
// }

// function handleCheckboxClick(evt, value) {
//   const { target } = evt;
//   const values = value.split('-');
//   if (filterSettings) {
//     if (target.checked
//         && Number(values[0]) === filterSettings.monthNumber
//         && Number(values[1]) === filterSettings.year
//     ) {
//       target.checked = false;
//       setIsChecked(target.checked);
//       setFilterSettings(null);
//     }
//   }
// }
//! ШАГ 2 = из массива ивентов делаем массив вида [месяц, год] на каждый ивент
// const arrayOfDatesWithEvents = arrayOfSortedEvents.map((someEvent) => {
//   // взяли дату ивента, переделали в дату-объект
//   const dateObj = new Date(someEvent.startAt);
//   const month = dateObj.getMonth();
//   const year = dateObj.getFullYear();
//   // в массив вернулся НОМЕР месяца и ГОД
//   return { month, year };
// });
// console.log('arrayOfDatesWithEvents', arrayOfDatesWithEvents);

//! ШАГ 3 = выкидываем из массива arrayOfDatesWithEvents повторы
// const arrayOfUniqueDates = Object.values(
//   arrayOfDatesWithEvents.reduce((res, item) => ({
//     ...res,
//     [item.join('-')]: item
//   }), {})
// );
// const arrayOfUniqueDates = arrayOfDatesWithEvents
//   .filter((item, index, self) => self
//     .findIndex((t) => (t.month === item.month && t.year === item.year)) === index);
// console.log('arrayOfUniqueDatesNEW', arrayOfUniqueDates);

// const final = arrayOfUniqueDates.map((filter) => {
//   const name = changeCaseOfFirstLetter(months[filter.month]);
//   return {
//     filter,
//     name,
//     isActive: false
//   };
// });
// console.log('final', final);

// setFilters(final);
// setFilters(() => );
// console.log(filters);

// const tags = arrayOfUniqueDates.map((date) => {

// });
//! ШАГ 4 = на основании хронологического массива без дубликатов генерируем кнопки
// function tagsButtonsToRender() {
//   return arrayOfUniqueDates.map((date) => {
//     const tagTitle = months[date[0]];
//     const monthNumber = months.indexOf(months[date[0]]);
//     const year = date[1];
//     const filters = { year, monthNumber };

//     return (
//       <li className="tags__list-item" key={`${monthNumber}-${year}`}>
//         <PseudoButtonTag
//           type="radio"
//           name="months"
//           value={`${monthNumber}-${year}`}
//           title={tagTitle}
//           filters={filters}
//           onChange={handleCheckboxChange}
//           onClick={handleCheckboxClick}
//         />
//       </li>
//     );
//   });
// }
//* ШАГ 3 выкидываем из массива arrayOfDatesWithEvent повторы
// const arrayOfUniqueDates = arrayOfDatesWithEvents
//   .filter((item, index, self) => self
//     .findIndex((t) => (t.month === item.month && t.year === item.year)) === index);
