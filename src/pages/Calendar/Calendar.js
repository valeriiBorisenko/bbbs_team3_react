/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import './Calendar.scss';
import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { months } from '../../config/constants';
import { renderFilterTags, changeRadioTagState } from '../../utils/filter-tags';
import Api from '../../utils/api';
import {
  BasePage,
  TitleH1,
  CardCalendar,
  AnimatedPageContainer,
  Loader
} from './index';
import { changeCaseOfFirstLetter } from '../../utils/utils';

function Calendar({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  // dataCalendar,
  onOpenLoginPopup
}) {
  const currentUser = useContext(CurrentUserContext);
  console.log(currentUser);

  // поднятие страницы к хедеру при загрузке
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // загрузка данных страницы календаря, если ты залогиненный
  const [calendarPageData, setDataCalendar] = useState([]);
  useEffect(() => {
    if (currentUser) {
      Api.getCalendarPageData()
        .then((events) => setDataCalendar(events))
        .catch((error) => {
          // setIsPopupErrorOpen(true);
          console.log(error);
        });
    }
    // else {
    //   setDataCalendar([]);
    // }
  }, [currentUser]);
  //! надо делать какой то стопор в виде isLoading

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
  const handleFilterClick = (inputValue, isChecked) => {
    console.log('tyt');
    console.log(filters);
    console.log(isChecked);
    changeRadioTagState(setFilters, { inputValue, isChecked });
    setIsFiltersUsed(true);
    console.log(filters);
  };

  //! первый useEffect, установка отсортированного массива
  useEffect(() => {
    if (calendarPageData) {
      const arrayOfSortedEvent = [...calendarPageData].sort((a, b) => {
        const date1 = new Date(a.startAt);
        const date2 = new Date(b.startAt);
        return date1 - date2;
      });
      setFilteredCardData(arrayOfSortedEvent);
      setSortedArray(arrayOfSortedEvent);
    }
  }, [calendarPageData]);

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
      console.log(filters);
      console.log(activeFilter);
      if (!activeFilter) {
        console.log('if');
        console.log(filteredCardData);
        setSortedArray(filteredCardData);
      } else {
        console.log('else');
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
    console.log('3ий useEffect');
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // как надо будет рисовать все
  // if (залогинен) {
  //   if (есть ивенты по городу) {
  //     рисуй ивенты
  //     if (длина массива > 1) {
  //       покажи фильтры
  //     } else {

  //     }
  //   } else {
  //     покажи заглушку // returnAnimatedContainer
  //   }
  // } else {
  //   покажи попап логина
  // }

  const dataForCurrentCityExist = calendarPageData.length > 0;
  // отрисовка заглушки
  function returnAnimatedContainer() {
    return (
      <AnimatedPageContainer
        titleText="Мы работаем над планом мероприятий на ближайшие месяцы."
        buttonText="Вернуться на главную"
      />
    );
  }

  // отрисовка массива фильтров
  function renderTagsContainder() {
    if (filters.length > 1) {
      return (
        <div className="tags fade-in">
          <ul className="tags__list">
            {renderFilterTags(filters, 'month', handleFilterClick)}
          </ul>
        </div>
      );
    }

    return null;
  }

  // отрисовка карточек ивентов
  function renderEventCards(eventsArray) {
    const cards = eventsArray.map((cardData) => (
      <CardCalendar
        key={cardData.id}
        cardData={cardData}
        onEventSignUpClick={eventSignUpHandler}
        onEventFullDescriptionClick={onEventFullDescriptionClick}
        sectionClass="fade-in"
      />
    ));
    return cards;
  }

  // главная функция рендера
  function renderPageContent() {
    // незалогинен
    if (currentUser == null) {
      return onOpenLoginPopup();
    }

    console.log(currentUser);
    // залогинен и есть ивенты
    if (currentUser !== null && dataForCurrentCityExist) {
      return (
        <>
          <TitleH1 title="Календарь" />

          <div className="calendar-page__container">
            {renderTagsContainder()}

            <div className="calendar-page__grid">
              {renderEventCards(sortedArray)}
            </div>
          </div>
        </>
      );
    }

    // залогинен и нет ивентов
    //! (есть ошибки, проскакивает использование)
    console.log('fail', currentUser, dataForCurrentCityExist, calendarPageData);
    return returnAnimatedContainer();
  }

  // console.log(calendarPageData);
  return (
    <BasePage>
      <Helmet>
        <title>Календарь</title>
        <meta name="description" content="Календарь событий и мероприятий для наставников" />
      </Helmet>
      <section className="calendar-page page__section fade-in">
        {renderPageContent()}
        {/* { (calendarPageData && calendarPageData?.length > 0) ? (
          <>
            <TitleH1 title="Календарь" />

            {calendarPageData.length > 0 ? (
              <div className="calendar-page__container">
                {filters.length > 1 && (
                <div className="tags fade-in">
                  <ul className="tags__list">
                    {renderFilterTags(filters, 'month', handleFilterClick)}
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
          </>
        ) : (
          <AnimatedPageContainer
            titleText="Мы работаем над планом мероприятий на ближайшие месяцы."
            buttonText="Вернуться на главную"
          />
        ) } */}
      </section>
    </BasePage>
  );
}
Calendar.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  onOpenLoginPopup: PropTypes.func
};

Calendar.defaultProps = {
  onEventSignUpClick: () => {},
  onEventFullDescriptionClick: () => {},
  onOpenLoginPopup: () => {}
};

export default Calendar;
