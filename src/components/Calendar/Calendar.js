import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import TitleH1 from '../ui/TitleH1/TitleH1';
import './Calendar.scss';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';
import Loader from '../ui/Loader/Loader';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { months } from '../../utils/constants';

function Calendar({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  clickButton,
  dataCalendar,
  isBooked,
  onOpenLoginPopup,
  isLoding
}) {
  useSmoothScrollOnWindow({ top: 0 });

  function eventSignUpHandler(cardData) {
    onEventSignUpClick(cardData, cardData.booked);
  }

  const currentUser = useContext(CurrentUserContext);

  // работа с фильтр-кнопками, их стейты
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [filteredCardData, setFilteredCardData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [filterSettings, setFilterSettings] = useState(null);

  // создание кнопок с месяцами
  //! ШАГ 1 = сортируем все ивенты по хронологии
  const arrayOfSortedEvents = dataCalendar.sort((a, b) => {
    const date1 = new Date(a.startAt);
    const date2 = new Date(b.startAt);
    return date1 - date2;
  });

  // серия функций фильтрации ивентов под нажатый фильтр
  useEffect(() => {
    if (filterSettings) {
      const { year, monthNumber } = filterSettings;
      const min = new Date(year, monthNumber);
      const max = new Date(year, monthNumber + 1);
      const filteredArrayOfEvents = arrayOfSortedEvents.filter((eventItem) => {
        const date = new Date(eventItem.startAt);

        return date >= min && date <= max;
      });
      setFilteredCardData(filteredArrayOfEvents);
    }

    setIsFiltersUsed(isChecked);
  }, [isChecked, arrayOfSortedEvents, filterSettings]);

  function handleCheckboxChange(evt, filters) {
    const { target } = evt;
    setIsChecked(target.checked);
    setFilterSettings(filters);
  }

  function handleCheckboxClick(evt, value) {
    const { target } = evt;
    const values = value.split('-');
    if (filterSettings) {
      if (target.checked
          && Number(values[0]) === filterSettings.monthNumber
          && Number(values[1]) === filterSettings.year
      ) {
        target.checked = false;
        setIsChecked(target.checked);
        setFilterSettings(null);
      }
    }
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

  //! ШАГ 3 = выкидываем из массива arrayOfDatesWithEvents повторы
  const arrayOfUniqueDates = Object.values(
    arrayOfDatesWithEvents.reduce((res, item) => ({
      ...res,
      [item.join('-')]: item
    }), {})
  );

  //! ШАГ 4 = на основании хронологического массива без дубликатов генерируем кнопки
  function tagsButtonsToRender() {
    return arrayOfUniqueDates.map((date) => {
      const tagTitle = months[date[0]];
      const monthNumber = months.indexOf(months[date[0]]);
      const year = date[1];
      const filters = { year, monthNumber };

      return (
        <li className="tags__list-item" key={`${monthNumber}-${year}`}>
          <PseudoButtonCheckbox
            type="radio"
            name="months"
            value={`${monthNumber}-${year}`}
            title={tagTitle}
            filters={filters}
            onChange={handleCheckboxChange}
            onClick={handleCheckboxClick}
          />
        </li>
      );
    });
  }

  const whatDataToRender = isFiltersUsed ? filteredCardData : arrayOfSortedEvents;

  return !isLoding ? (
    <>
      <Helmet>
        <title>Календарь</title>
        <meta name="description" content="Календарь событий и мероприятий для настаников" />
      </Helmet>
      <section className="lead page__section fade-in">
        <TitleH1 title="Календарь" />
        {arrayOfUniqueDates.length > 1 ? (
          <div className="tags">
            <ul className="tags__list">
              {tagsButtonsToRender()}
            </ul>
          </div>
        ) : null}

        <section className="calendar-container">
          {whatDataToRender.map((data) => (
            <CardCalendar
              key={data.id}
              cardData={data}
              onEventSignUpClick={eventSignUpHandler}
              onEventFullDescriptionClick={onEventFullDescriptionClick}
              clickButton={clickButton}
              isBooked={isBooked}
            />
          ))}
        </section>

        { currentUser ? '' : onOpenLoginPopup()}
      </section>
    </>
  ) : (
    <Loader />
  );
}
Calendar.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  clickButton: PropTypes.func,
  dataCalendar: PropTypes.arrayOf(PropTypes.object),
  isBooked: PropTypes.bool,
  onOpenLoginPopup: PropTypes.func,
  isLoding: PropTypes.bool.isRequired
};

Calendar.defaultProps = {
  onEventSignUpClick: undefined,
  dataCalendar: [],
  onEventFullDescriptionClick: undefined,
  clickButton: undefined,
  isBooked: false,
  onOpenLoginPopup: undefined
};

export default Calendar;
