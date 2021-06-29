/* eslint-disable no-unused-vars */
import './Calendar.scss';
import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useScrollToTop, useDebounce } from '../../hooks/index';
import useEventSubscription from '../../hooks/useEventSubscription';
import { months } from '../../config/constants';
import { renderFilterTags, handleRadioBehavior } from '../../utils/filter-tags';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import Api from '../../utils/api';
import {
  BasePage,
  TitleH1,
  CardCalendar,
  AnimatedPageContainer,
  Loader,
} from './index';

function Calendar({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  onOpenLoginPopup,
}) {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  // загрузка данных страницы календаря, если ты залогиненный
  const [calendarPageData, setCalendarPageData] = useState(null);

  // весь список доступных фильтров
  // { isActive, name, filter }
  const [filters, setFilters] = useState(null);

  // флаг использования фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // нужно ли рисовать фильтры (если месяц всего 1 - не рисуем)
  const dataForCurrentCityExist = calendarPageData?.length > 0;

  function getCalendarPageData() {
    Api.getCalendarPageData()
      .then((events) => setCalendarPageData(events))
      .catch((error) => console.log(error));
  }

  // загрузка главной страницы при старте
  useEffect(() => {
    if (currentUser) {
      getCalendarPageData();
    } else {
      onOpenLoginPopup();
    }
  }, [currentUser]);

  // загрузка фильтров страницы при старте
  useEffect(() => {
    if (currentUser) {
      Api.getActiveMonthTags()
        .then((activeMonths) => {
          const customFilters = activeMonths.map((activeMonth) => {
            const filterName = changeCaseOfFirstLetter(months[activeMonth]);
            return {
              isActive: false,
              name: filterName,
              filter: activeMonth,
            };
          });
          setFilters(customFilters);
        })
        .catch((error) => console.log(error));
    }
  }, [currentUser?.city]);

  function handleFiltration() {
    console.log('handleFiltration');
    console.log('isFiltersUsed', isFiltersUsed);
    if (isFiltersUsed) {
      const activeFilter = filters.find((filter) => filter.isActive);
      console.log(activeFilter);
      if (activeFilter) {
        console.log('activeFilter IF');
        Api.getActualEventsForFilter(activeFilter.filter)
          .then((events) => setCalendarPageData(events))
          .catch((error) => console.log(error));
      } else {
        getCalendarPageData();
      }
      setIsFiltersUsed(false);
    }
  }

  function handleFilterClick(inputValue, isChecked) {
    handleRadioBehavior(setFilters, { inputValue, isChecked });
    setIsFiltersUsed(true);
  }

  const debounceFiltration = useDebounce(handleFiltration, 1500);
  useEffect(() => {
    // в дальнейшем надо изменить количество секунд
    debounceFiltration();
  }, [isFiltersUsed]);

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
    return (
      <div className="tags fade-in">
        <ul className="tags__list">
          {renderFilterTags(filters, 'month', handleFilterClick)}
        </ul>
      </div>
    );
  }

  // отрисовка карточек ивентов
  function renderEventCards(eventsArray) {
    const cards = eventsArray.map((cardData) => (
      <CardCalendar
        key={cardData.id}
        cardData={cardData}
        onEventSignUpClick={onEventSignUpClick}
        onEventFullDescriptionClick={onEventFullDescriptionClick}
        sectionClass="fade-in"
      />
    ));
    return cards;
  }

  // главная функция рендера
  function renderPageContent() {
    // залогинен и есть ивенты
    if (currentUser && dataForCurrentCityExist) {
      return (
        <>
          <TitleH1 title="Календарь" />

          <div className="calendar-page__container">
            {filters?.length > 1 && renderTagsContainder()}

            <div className="calendar-page__grid">
              {renderEventCards(calendarPageData)}
            </div>
          </div>
        </>
      );
    }

    // залогинен и нет ивентов
    if (currentUser && !dataForCurrentCityExist && calendarPageData) {
      return returnAnimatedContainer();
    }

    return null;
  }

  // глобальный лоадер
  if (!calendarPageData || !filters) {
    return <Loader isCentered />;
  }

  return (
    <BasePage>
      <Helmet>
        <title>Календарь</title>
        <meta
          name="description"
          content="Календарь событий и мероприятий для наставников"
        />
      </Helmet>
      <section className="calendar-page page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}
Calendar.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  onOpenLoginPopup: PropTypes.func,
};

Calendar.defaultProps = {
  onEventSignUpClick: () => {},
  onEventFullDescriptionClick: () => {},
  onOpenLoginPopup: () => {},
};

export default Calendar;
