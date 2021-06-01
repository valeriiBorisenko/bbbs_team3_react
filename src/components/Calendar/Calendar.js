import React from 'react';
import PropTypes from 'prop-types';
import TitleH1 from '../ui/TitleH1/TitleH1';
import ButtonTags from '../ui/Button/ButtonTags';
import './Calendar.scss';
import CardCalendar from '../ui/CardCalendar/CardCalendar';

function Calendar({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  clickButton,
  dataCalendar,
  isBooked,
  isAuthorized,
  onLoginFormSubmit
}) {
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
  const [isFiltersUsed, setIsFiltersUsed] = React.useState(false);
  const [filteredCardData, setFilteredCardData] = React.useState([]);
  // const [cardsData, setCardsData] = React.useState(() => dataCalendar);

  //! ШАГ 1 = сортируем все ивенты по хронологии
  const arrayOfSortedEvents = dataCalendar.sort((a, b) => {
    const date1 = new Date(a.startAt);
    const date2 = new Date(b.startAt);
    return date1 - date2;
  });
  // setCardsData(arrayOfSortedEvents);
  // console.log('NEW arrayOfSortedEvents', arrayOfSortedEvents);

  //! фильтрация ивентов при нажатии на тагс
  function handleFiltration({ year, monthNumber }) {
    console.log('year', year);
    console.log('monthNumber', monthNumber);
    // надо из ивента подставить год и месяц ивента
    const min = new Date(year, monthNumber);
    const max = new Date(year, monthNumber + 1);

    const filteredArrayOfEvents = arrayOfSortedEvents.filter((eventItem) => {
      const date = new Date(eventItem.startAt);

      return date >= min && date <= max;
    });
    // console.log('filteredArrayOfEvents', filteredArrayOfEvents);

    setFilteredCardData(filteredArrayOfEvents);
    setIsFiltersUsed(true);
    // console.log('cardsData', cardsData);
  }

  //! ШАГ 2 = из массива ивентов делаем массив вида [месяц, год] на каждый ивент
  const arrayOfDatesWithEvents = arrayOfSortedEvents.map((someEvent) => {
    // взяли дату ивента, переделали в дату-объект
    const dateObj = new Date(someEvent.startAt);
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    // в массив вернулся НОМЕР месяца и ГОД
    return [month, year];
  });
  // console.log('arrayOfAllMonthsWithEvents', arrayOfDatesWithEvents);

  //! ШАГ 3 = выкидываем из массива arrayOfDatesWithEvents повторы
  const arrayOfUniqueDates = Object.values(arrayOfDatesWithEvents.reduce((res, item) => ({
    ...res,
    [item.join('-')]: item
  }), {}));
  // console.log('finalArray', finalArray);

  //! ШАГ 4 = на основании хронологического массива без дубликатов генерируем кнопки
  const tagsButtons = arrayOfUniqueDates.map((date) => {
    const tagTitle = months[date[0]];
    const monthNumber = months.indexOf(months[date[0]]);
    const year = date[1];
    const filters = {
      year,
      monthNumber
    };

    return (
      <li className="tags__list-item" key={monthNumber}>
        <ButtonTags
          title={tagTitle}
          color="black"
          enableFiltation={handleFiltration}
          filters={filters}
        />
      </li>
    );
  });

  const whatToRender = isFiltersUsed ? filteredCardData : arrayOfSortedEvents;

  return (
    <section className="lead page__section fade-in">
      <TitleH1 title="Календарь" />
      <div className="tags">
        <ul className="tags__list">
          {tagsButtons}
        </ul>
      </div>
      <section className="calendar-container">
        {whatToRender.map((data) => (
          <CardCalendar
            key={data.id}
            data={data}
            onEventSignUpClick={onEventSignUpClick}
            onEventFullDescriptionClick={onEventFullDescriptionClick}
            clickButton={clickButton}
            isBooked={isBooked}
          />
        ))}
      </section>
      { isAuthorized ? '' : onLoginFormSubmit()}
    </section>
  );
}

Calendar.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  clickButton: PropTypes.func,
  dataCalendar: PropTypes.arrayOf(PropTypes.object),
  isBooked: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  onLoginFormSubmit: PropTypes.func
};

Calendar.defaultProps = {
  onEventSignUpClick: undefined,
  onEventFullDescriptionClick: undefined,
  clickButton: undefined,
  dataCalendar: [],
  isBooked: false,
  isAuthorized: false,
  onLoginFormSubmit: undefined
};

export default Calendar;
