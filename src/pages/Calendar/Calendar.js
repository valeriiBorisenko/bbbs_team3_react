/* eslint-disable no-unused-vars */
import './Calendar.scss';
import { useEffect, useState, useContext } from 'react';
import calendarPageTexts from '../../locales/calendar-page-RU';
import { CurrentUserContext, PopupsContext } from '../../contexts/index';
import {
  useScrollToTop,
  useDebounce,
  useEventBooking,
} from '../../hooks/index';
import { months, DELAY_DEBOUNCE } from '../../config/constants';
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

// const INDEX_ERROR_BETWEEN_NUMBER_AND_INDEX = 1;
const INITIAL_PAGE_INDEX = 0;
export const PAGE_SIZE_PAGINATE = {
  small: 6,
  medium: 8,
  big: 12,
};

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

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [pageIndex, setPageIndex] = useState(INITIAL_PAGE_INDEX);

  // определение размера страницы
  useEffect(() => {
    console.log('useEffect ресайз');
    const small = window.matchMedia('(max-width: 1024px)');
    const medium = window.matchMedia('(max-width: 1440px)');

    const listener = () => {
      if (small.matches) {
        // 320px-1024px по 6 элементов на странице
        setPageSize(PAGE_SIZE_PAGINATE.small);
      } else if (medium.matches) {
        // 1024px-1440px по 8 элементов на странице
        setPageSize(PAGE_SIZE_PAGINATE.medium);
      } else {
        // больше 1440px по 12 элементов на странице
        setPageSize(PAGE_SIZE_PAGINATE.big);
      }
    };
    listener();

    small.addEventListener('change', listener);
    medium.addEventListener('change', listener);
    // largeQuery.addEventListener('change', listener);

    return () => {
      small.removeEventListener('change', listener);
      medium.removeEventListener('change', listener);
      // largeQuery.removeEventListener('change', listener);
    };
  }, []);

  // нужно ли рисовать фильтры (если месяц всего 1 - не рисуем)
  const areThereEventsMoreForOneMonth = calendarPageData?.length > 0;

  // вспомогательная функция загрузки ивентов
  function getInitialPageData() {
    console.log('getInitialPageData FUNC');
    setIsCityChanging(true);
    const offset = pageSize * pageIndex;
    console.log('offset', offset);
    console.log('pageSize', pageSize);
    getCalendarPageData({ limit: pageSize, offset })
      .then((calendarEvents) => {
        const { results, count } = calendarEvents;
        setTotalPages(Math.ceil(count / pageSize));
        setCalendarPageData(results);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
        setIsCityChanging(false);
      });
  }

  // загрузка страницы палендаря при старте либо показ попапа логина
  useEffect(() => {
    console.log('useEffect загрузка страницы первичная');
    console.log('pageSize', pageSize);
    if (currentUser && pageSize) {
      console.log('useEffect IF');
      getInitialPageData();
    }

    if (!currentUser) {
      openPopupLogin();
    }
  }, [pageSize, currentUser]);

  // загрузка фильтров страницы при старте
  useEffect(() => {
    if (currentUser) {
      console.log('useEffect запрсо фильтров IF');
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

  // хэндлер фильтр-кнопки
  function handleFilterButtonClick(inputValue, isChecked) {
    handleRadioBehavior(setFilters, { inputValue, isChecked });
    setIsFiltersUsed(true);
  }

  // вспомогательная функция фильтрации
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
    }
  }

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  useEffect(() => {
    // в дальнейшем надо изменить количество секунд
    if (isFiltersUsed) {
      setIsLoading(true);
      debounceFiltration();
    }
    setIsFiltersUsed(false);
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
        sectionClass="scale-in"
      />
    ));
    return cards;
  }

  // function renderPagination() {
  //   if (pageCount > 1) {
  //     return (
  //       <Paginate
  //         sectionClass="cards-section__pagination"
  //         pageCount={pageCount}
  //         value={pageNumber}
  //         onChange={setPageNumber}
  //       />
  //     );
  //   }
  //   return null;
  // }

  // главная функция рендера
  function renderPageContent() {
    // залогинен и есть ивенты
    if (currentUser && areThereEventsMoreForOneMonth) {
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
                  handleClick={handleFilterButtonClick}
                />
              )}

              {isLoading ? (
                <Loader isNested />
              ) : (
                <div className="calendar-page__grid">
                  {renderEventCardsContainer()}
                </div>
              )}
              {/* {renderPagination()} */}
            </div>
          )}
        </>
      );
    }

    // залогинен и нет ивентов для города вообще
    if (currentUser && !areThereEventsMoreForOneMonth && calendarPageData) {
      return returnAnimatedContainer();
    }

    return null;
  }

  // глобальный лоадер при первой загрузке
  if (!calendarPageData || !filters) {
    console.log('Global loader');
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="calendar-page page__section fade-in">
        {/* {currentUser ? renderPageContent() : openPopupLogin()} */}
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

export default Calendar;
