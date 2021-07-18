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
import { getCalendarPageData, getActiveMonthTags } from '../../api/afisha-page';
import {
  BasePage,
  TitleH1,
  CardCalendar,
  AnimatedPageContainer,
  Loader,
  TagsList,
  Paginate,
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

  // переход между фильтрами/страницами пагинации, лоадер
  const [isLoading, setIsLoading] = useState(false);
  // переход между городами, лоадер
  const [isGlobalLoader, setIsGlobalLoader] = useState(false);
  // лоадер для пагинации
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

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
  const [isFirstRender, setIsFirstRender] = useState(true);

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

    return () => {
      small.removeEventListener('change', listener);
      medium.removeEventListener('change', listener);
    };
  }, []);

  // нужно ли рисовать фильтры (если месяц всего 1 - не рисуем)
  const areThereEventsMoreForOneMonth = calendarPageData?.length > 0;

  function getActiveFilters() {
    if (!filters) {
      // обязательно возвращаем пустой массив
      return [];
    }

    return filters.filter((filter) => filter.isActive);
  }

  // общая функция загрузки ивентов
  function getPageData({ offset, activeFilters }) {
    console.log('NEW getPageData FUNC');
    getCalendarPageData({
      limit: pageSize,
      offset,
      months: activeFilters,
    })
      .then((events) => {
        const { results, count } = events;
        if (pageIndex === 0) {
          setTotalPages(Math.ceil(count / pageSize));
        }
        setCalendarPageData(results);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
        setIsGlobalLoader(false);
        setIsLoadingPaginate(false);
      });
  }

  // загрузка страницы палендаря при старте либо показ попапа логина
  useEffect(() => {
    console.log('useEffect загрузка страницы первичная');
    // console.log('pageSize', pageSize);
    if (currentUser && pageSize) {
      console.log('useEffect загрузка страницы первичная IF 1');
      const offset = pageSize * pageIndex;
      getPageData({ offset });
      setIsFirstRender(false);
    }

    if (!currentUser) {
      console.log('useEffect загрузка страницы первичная IF 2');
      openPopupLogin();
    }

    console.log(pageSize);
  }, [pageSize, currentUser]);

  // загрузка фильтров страницы при старте или смене города юзера
  useEffect(() => {
    if (currentUser) {
      console.log('useEffect currentUser?.city');
      setIsGlobalLoader(true);
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
    console.log('handleFiltration FUNC');
    const activeMonths = getActiveFilters();

    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;
    // фильтров нет (грузим стартовую страницу)
    if (activeMonths.length === 0) {
      console.log('handleFiltration IF');
      getPageData({ limit: pageSize, offset });
    } else {
      // фильтруемся по месяцу
      console.log('handleFiltration ELSE');
      const { filter } = activeMonths[0]; // задел под мультифильтры
      getPageData({ limit: pageSize, offset, activeFilters: filter });
    }
  }

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  // эффект фильтрации
  useEffect(() => {
    console.log('useEffect isFiltersUsed');
    // в дальнейшем надо изменить количество секунд
    if (isFiltersUsed) {
      console.log('useEffect isFiltersUsed IF');
      setIsLoading(true);
      debounceFiltration();
    }

    // провели фильтрацию, флажок фильтров меняем
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // эффект пагинации
  const debouncePaginate = useDebounce(getPageData, DELAY_DEBOUNCE);
  useEffect(() => {
    if (!isFirstRender) {
      console.log('useEffect pageIndex');
      console.log('pageIndex', pageIndex);
      const activeMonths = getActiveFilters();
      setIsLoadingPaginate(true);
      // при нажатых фильтрах нажимаем пагинацию
      if (activeMonths.length > 0) {
        console.log('useEffect pageIndex IF');
        const offset = pageSize * pageIndex;
        const { filter } = activeMonths[0]; // задел под мультифильтры
        debouncePaginate({ offset, activeFilters: filter });
      }

      // просто нажимаем пагинацию + месяц не выбран
      if (activeMonths.length === 0) {
        console.log('useEffect pageIndex ELSE');
        const offset = pageSize * pageIndex;
        debouncePaginate({ offset });
      }
    }
  }, [pageIndex]);

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
  // отрисовка заглушки, если ивентов нет
  function returnAnimatedContainer() {
    return (
      <>
        {isGlobalLoader ? (
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

  // фильтры
  function renderFilters() {
    return (
      <TagsList
        filterList={filters}
        name="month"
        handleClick={handleFilterButtonClick}
      />
    );
  }

  // блок пагинации
  function renderPagination() {
    return (
      <Paginate
        sectionClass="cards-section__pagination"
        pageCount={totalPages}
        value={pageIndex}
        onChange={setPageIndex}
      />
    );
  }

  // главная функция рендера
  function renderPageContent() {
    // залогинен и есть ивенты
    if (currentUser && areThereEventsMoreForOneMonth) {
      return (
        <>
          {/* лоадер смены городов */}
          {isGlobalLoader ? (
            <Loader isNested />
          ) : (
            <>
              <TitleH1 title={title} sectionClass="calendar-page__title" />
              <div className="calendar-page__container">
                {filters?.length > 1 && renderFilters()}

                {/* лоадер смены фильтров */}
                {isLoading ? (
                  <Loader isNested />
                ) : (
                  <>
                    {/* лоадер переключения пагинации */}
                    {isLoadingPaginate ? (
                      <Loader isNested />
                    ) : (
                      <div className="calendar-page__grid">
                        {renderEventCardsContainer()}
                      </div>
                    )}
                    {totalPages > 1 && renderPagination()}
                  </>
                )}
              </div>
            </>
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

  // глобальный лоадер при первой загрузке пока ждем ивенты и фильтры
  if (!calendarPageData || !filters) {
    console.log('Global loader');
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
