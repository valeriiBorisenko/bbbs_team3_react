import './Calendar.scss';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import calendarPageTexts from '../../locales/calendar-page-RU';
import {
  CurrentUserContext,
  ErrorsContext,
  PopupsContext,
} from '../../contexts';
import { useDebounce, useEventBooking } from '../../hooks';
import {
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
  localStAfishaEvent,
  months,
} from '../../config/constants';
import { handleRadioBehavior } from '../../utils/filter-tags';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import {
  getActiveMonthTags,
  getCalendarItem,
  getCalendarPageData,
} from '../../api/afisha-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardCalendar,
  Loader,
  Paginate,
  TagsList,
  TitleH1,
} from './index';
import { setLocalStorageData } from '../../hooks/useLocalStorage';

const { headTitle, headDescription, title, textStubNoData } = calendarPageTexts;

const INITIAL_PAGE_INDEX = 0;
export const PAGE_SIZE_PAGINATE = {
  small: 6,
  medium: 8,
  big: 12,
};

function Calendar() {
  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupLogin, openPopupAboutEvent, openPopupError } =
    useContext(PopupsContext);
  const { setError } = useContext(ErrorsContext);
  const { state } = useLocation();

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

  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // определение размера страницы
  useEffect(() => {
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
  // в будущем упростить эту функцию
  function getPageData({ offset, activeFilters }) {
    getCalendarPageData({
      limit: pageSize,
      offset,
      months: activeFilters,
    })
      .then((events) => {
        const { results, count } = events;
        setTotalPages(Math.ceil(count / pageSize));
        setCalendarPageData(results);
      })
      .catch(() => {
        if (isFiltersUsed) {
          setError({
            title: ERROR_MESSAGES.filterErrorMessage.title,
            button: ERROR_MESSAGES.filterErrorMessage.button,
          });
          openPopupError();
        } else {
          setIsPageError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsGlobalLoader(false);
        setIsLoadingPaginate(false);
      });
  }

  // Откртие попапа при переходе из поиска
  useEffect(() => {
    if (state) {
      getCalendarItem(state.id)
        .then((res) => {
          setLocalStorageData(localStAfishaEvent, res);
          openPopupAboutEvent();
        })
        .catch(() => setIsPageError(true));
    }
  }, [state]);

  // загрузка страницы палендаря при старте либо показ попапа логина
  useEffect(() => {
    if (currentUser && pageSize) {
      const offset = pageSize * pageIndex;
      getPageData({ offset });
      setIsFirstRender(false);
    }

    if (!currentUser) {
      openPopupLogin();
    }
  }, [pageSize, currentUser]);

  // загрузка фильтров страницы при старте или смене города юзера
  useEffect(() => {
    if (currentUser) {
      setIsGlobalLoader(true);
      getActiveMonthTags()
        .then((monthsTags) => {
          const customFilters = monthsTags.map((tag) => {
            const filterName = changeCaseOfFirstLetter(months[tag - 1]); // бэк считает с 1, у нас массив с 0
            return {
              isActive: false,
              name: filterName,
              filter: tag,
            };
          });
          setFilters(customFilters);
        })
        .catch(() => setIsPageError(true));
    }
  }, [currentUser?.city]);

  // хэндлер фильтр-кнопки
  function handleFilterButtonClick(inputValue, isChecked) {
    handleRadioBehavior(setFilters, { inputValue, isChecked });
    setIsFiltersUsed(true);
  }

  // вспомогательная функция фильтрации
  function handleFiltration() {
    const activeMonths = getActiveFilters();

    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;
    // фильтров нет (грузим стартовую страницу)
    if (activeMonths.length === 0) {
      getPageData({ limit: pageSize, offset });
    } else {
      // фильтруемся по месяцу
      const { filter } = activeMonths[0]; // задел под мультифильтры
      getPageData({ limit: pageSize, offset, activeFilters: filter });
    }
  }

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  // эффект фильтрации
  useEffect(() => {
    // в дальнейшем надо изменить количество секунд
    if (isFiltersUsed) {
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
      const activeMonths = getActiveFilters();
      setIsLoadingPaginate(true);
      // при нажатых фильтрах нажимаем пагинацию
      if (activeMonths.length > 0) {
        const offset = pageSize * pageIndex;
        const { filter } = activeMonths[0]; // задел под мультифильтры
        debouncePaginate({ offset, activeFilters: filter });
      }

      // просто нажимаем пагинацию + месяц не выбран
      if (activeMonths.length === 0) {
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
          <Loader isPaginate />
        ) : (
          <AnimatedPageContainer titleText={textStubNoData} />
        )}
      </>
    );
  }

  // отрисовка карточек ивентов
  function renderEventCardsContainer() {
    return calendarPageData.map((cardData) => (
      <CardCalendar
        key={cardData.id}
        cardData={cardData}
        onEventSignUpClick={handleEventBooking}
        onEventDescriptionClick={openPopupAboutEvent}
        sectionClass="scale-in"
      />
    ));
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
    // ошибка загрузки данных
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }

    // залогинен и есть ивенты
    if (currentUser && areThereEventsMoreForOneMonth) {
      return (
        <>
          {/* лоадер смены городов */}
          {isGlobalLoader ? (
            <Loader isPaginate />
          ) : (
            <>
              <TitleH1 title={title} sectionClass="calendar-page__title" />
              <div className="calendar-page__container">
                {filters?.length > 1 && renderFilters()}

                {/* лоадер смены фильтров */}
                {isLoading ? (
                  <Loader isPaginate />
                ) : (
                  <>
                    {/* лоадер переключения пагинации */}
                    {isLoadingPaginate ? (
                      <Loader isPaginate />
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
  if ((!calendarPageData || !filters) && !isPageError) {
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
