import './Calendar.scss';
import { useEffect, useState, useContext } from 'react';
import calendarPageTexts from '../../locales/calendar-page-RU';
import { CurrentUserContext, PopupsContext } from '../../contexts/index';
import {
  useScrollToTop,
  useDebounce,
  useEventBooking,
} from '../../hooks/index';
import { months, DELAY_DEBOUNCE, DELAY_RENDER } from '../../config/constants';
import { handleRadioBehavior } from '../../utils/filter-tags';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import {
  getCalendarPageData,
  getActiveMonthTags,
  getEventsByFilters,
} from '../../api/afisha-page';
import {
  BasePage,
  TitleH1,
  CardCalendar,
  AnimatedPageContainer,
  Loader,
  TagsList,
} from './index';

const { headTitle, headDescription, title, textStubNoData } = calendarPageTexts;

function Calendar() {
  useScrollToTop();

  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupLogin, openPopupAboutEvent } = useContext(PopupsContext);

  // переход между фильтрами, лоадер
  const [isLoading, setIsLoading] = useState(false);
  // переход между городами, лоадер
  const [isCityChanging, setIsCityChanging] = useState(false);

  // загрузка данных страницы календаря, если ты залогиненный
  const [calendarPageData, setCalendarPageData] = useState(null);

  // весь список доступных фильтров
  // { isActive, name, filter }
  const [filters, setFilters] = useState(null);

  // флаг использования фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // нужно ли рисовать фильтры (если месяц всего 1 - не рисуем)
  const dataForCurrentCityExist = calendarPageData?.length > 0;

  function getInitialPageData() {
    setIsCityChanging(true);
    getCalendarPageData()
      .then((calendarEvents) => setCalendarPageData(calendarEvents))
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
        setIsCityChanging(false);
      });
  }

  // загрузка главной страницы при старте
  useEffect(() => {
    if (currentUser) {
      getInitialPageData();
    } else {
      setTimeout(() => {
        openPopupLogin();
      }, DELAY_RENDER);
    }
  }, [currentUser]);

  // загрузка фильтров страницы при старте
  useEffect(() => {
    if (currentUser) {
      getActiveMonthTags()
        .then((monthsTags) => {
          const customFilters = monthsTags.map((tag) => {
            const filterName = changeCaseOfFirstLetter(months[tag]);
            return {
              isActive: false,
              name: filterName,
              filter: tag,
            };
          });
          setFilters(customFilters);
        })
        .catch((error) => console.log(error));
    }
  }, [currentUser?.city]);

  function handleFiltration() {
    if (isFiltersUsed) {
      const activeFilter = filters.find((filter) => filter.isActive);
      if (activeFilter) {
        getEventsByFilters(activeFilter.filter)
          .then((filteredEvents) => setCalendarPageData(filteredEvents))
          .catch((error) => console.log(error))
          .finally(() => setIsLoading(false));
      } else {
        getInitialPageData();
      }
      setIsFiltersUsed(false);
    }
  }

  function handleFilterClick(inputValue, isChecked) {
    handleRadioBehavior(setFilters, { inputValue, isChecked });
    setIsFiltersUsed(true);
  }

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  useEffect(() => {
    // в дальнейшем надо изменить количество секунд
    if (isFiltersUsed) {
      setIsLoading(true);
    }
    debounceFiltration();
  }, [isFiltersUsed]);

  // подписка/отписка от ивентов
  const { handleEventBooking, selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setCalendarPageData(() =>
        calendarPageData.map((event) =>
          event.id === selectedEvent.id ? selectedEvent : event
        )
      );
    }
  }, [selectedEvent]);

  // рендеринг
  // отрисовка заглушки
  function returnAnimatedContainer() {
    return (
      <>
        {isCityChanging ? (
          <Loader isNested />
        ) : (
          <AnimatedPageContainer titleText={textStubNoData} />
        )}
      </>
    );
  }

  // отрисовка карточек ивентов
  function renderEventCardsContainer() {
    const cards = calendarPageData.map((cardData) => (
      <CardCalendar
        key={cardData.id}
        cardData={cardData}
        onEventSignUpClick={handleEventBooking}
        onEventDescriptionClick={openPopupAboutEvent}
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
          <TitleH1 title={title} sectionClass="calendar-page__title" />

          {isCityChanging ? (
            <Loader isNested />
          ) : (
            <div className="calendar-page__container">
              {filters?.length > 1 && (
                <TagsList
                  filterList={filters}
                  name="month"
                  handleClick={handleFilterClick}
                />
              )}

              {isLoading ? (
                <Loader isNested />
              ) : (
                <div className="calendar-page__grid">
                  {renderEventCardsContainer()}
                </div>
              )}
            </div>
          )}
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
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="calendar-page page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

export default Calendar;
