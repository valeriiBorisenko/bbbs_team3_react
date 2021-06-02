import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import TitleH1 from '../ui/TitleH1/TitleH1';
import './Calendar.scss';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';
import Loader from '../ui/Loader/Loader';

function Calendar({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  clickButton,
  dataCalendar,
  isBooked,
  isAuthorized,
  onOpenLoginPopup,
  isLoding
}) {
  useSmoothScrollOnWindow({ top: 0 });

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

  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [filteredCardData, setFilteredCardData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [filterSettings, setFilterSettings] = useState(null);

  //! ШАГ 1 = сортируем все ивенты по хронологии
  const arrayOfSortedEvents = dataCalendar.sort((a, b) => {
    const date1 = new Date(a.startAt);
    const date2 = new Date(b.startAt);
    return date1 - date2;
  });

  //! функция фильтрации ивентов под нажатый фильтр
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
  }, [isChecked, filterSettings]);

  const handleCheckboxChange = (evt, filters) => {
    const { target } = evt;
    setIsChecked(target.checked);
    setFilterSettings(filters);
  };

  const handleCheckboxClick = (evt, dataset) => {
    const { target } = evt;
    if (filterSettings) {
      if (target.checked && Number(dataset) === filterSettings.monthNumber) {
        target.checked = false;
        setIsChecked(target.checked);
        setFilterSettings(null);
      }
    }
  };

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
  const arrayOfUniqueDates = Object.values(arrayOfDatesWithEvents.reduce((res, item) => ({
    ...res,
    [item.join('-')]: item
  }), {}));

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
        <PseudoButtonCheckbox
          type="radio"
          name="months"
          value={tagTitle}
          title={tagTitle}
          datasetForFilter={String(monthNumber)}
          filters={filters}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
        />
      </li>
    );
  });

  const whatToRender = isFiltersUsed ? filteredCardData : arrayOfSortedEvents;

  return !isLoding ? (
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
      { isAuthorized ? '' : onOpenLoginPopup()}
    </section>
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
  isAuthorized: PropTypes.bool,
  onOpenLoginPopup: PropTypes.func,
  isLoding: PropTypes.bool.isRequired
};

Calendar.defaultProps = {
  onEventSignUpClick: undefined,
  dataCalendar: [],
  onEventFullDescriptionClick: undefined,
  clickButton: undefined,
  isBooked: false,
  isAuthorized: false,
  onOpenLoginPopup: undefined
};

export default Calendar;
