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
  useSmoothScrollOnWindow({ top: 0 });
  const currentUser = useContext(CurrentUserContext);

  const eventSignUpHandler = (cardData) => {
    onEventSignUpClick(cardData, cardData.booked);
  };

  // весь список доступных фильтров
  const [filters, setFilters] = useState([]);

  // флаг использования фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // мутабельный массив для применения фильтров (отсортированный)
  const [sortedArray, setSortedArray] = useState([]);

  // массив отфильтрованных ивентов с даты, не мутировать!
  const [filteredCardData, setFilteredCardData] = useState([]);

  // хэндлер клика по фильтру МЕСЯЦ
  const handleFilterClick = (inputName, isChecked) => {
    changeRadioTagState(setFilters, { inputName, isChecked });
    setIsFiltersUsed(true);
  };

  //! первый useEffect, установка отсортированного массива
  useEffect(() => {
    const arrayOfSortedEvent = [...dataCalendar].sort((a, b) => {
      const date1 = new Date(a.startAt);
      const date2 = new Date(b.startAt);
      return date1 - date2;
    });
    setFilteredCardData(arrayOfSortedEvent);
    setSortedArray(arrayOfSortedEvent);
  }, [dataCalendar]);

  //! второй useEffect, сбор списка фильтров
  useEffect(() => {
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
        filter: JSON.stringify(filter),
        name,
        isActive: false
      };
    });

    setFilters(finallArrayOfTagsData);
  }, [filteredCardData]);

  // функция-фильтратор
  const handleFiltration = () => {
    if (isFiltersUsed) {
      const activeFilter = filters.find((filter) => filter.isActive);
      if (!activeFilter) {
        setSortedArray(filteredCardData);
      } else {
        const { month, year } = JSON.parse(activeFilter.filter);
        const min = new Date(year, month);
        const max = new Date(year, month + 1);
        const filteredArrayOfEvents = filteredCardData.filter((eventItem) => {
          const date = new Date(eventItem.startAt);
          return date >= min && date <= max;
        });
        setSortedArray(filteredArrayOfEvents);
      }
    }
  };

  //! третий useEffect (запуск фильтрации)
  useEffect(() => {
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

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
              {sortedArray.map((data) => (
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
