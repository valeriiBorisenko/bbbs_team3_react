import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import calendarPageTexts from './locales/RU';
import { CurrentUserContext, PopupsContext } from '../../contexts';
import { ERROR_MESSAGES, localStAfishaEvent } from '../../config/constants';
import {
  useEventBooking,
  useFiltrationAndPagination,
  usePageWidth,
} from '../../hooks';
import {
  getLocalStorageData,
  setLocalStorageData,
} from '../../hooks/useLocalStorage';
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
import './Calendar.scss';

const { headTitle, headDescription, title, textStubNoData } = calendarPageTexts;

const PAGE_SIZE_PAGINATE = {
  small: 6,
  medium: 8,
  default: 12,
};

const MAX_SCREEN_WIDTH = {
  small: 1024,
  medium: 1440,
};

function Calendar() {
  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupLogin, openPopupAboutEvent } = useContext(PopupsContext);
  const { state } = useLocation();

  // определяет, сколько карточек показывать на странице в зависимости от ширины экрана
  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // стейт для работы с мероприятиями
  const [calendarPageData, setCalendarPageData] = useState(null);
  const [isCityChanged, setIsCityChanged] = useState(false);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getCalendarPageData,
    apiGetFiltersCallback: getActiveMonthTags,
    apiFilterNames: {
      tags: 'months',
    },
    pageSize,
    setIsPageError,
    isCalendarPage: true,
  };

  const {
    dataToRender,
    filters,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
    firstPageRender,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

  // показ попапа логина и отложенная загрузка
  useEffect(() => {
    if (!currentUser) {
      openPopupLogin();
    } else if (isPageLoading && pageSize) {
      firstPageRender();
    }
  }, [currentUser, pageSize]);

  // обновление стейта данных для работы
  useEffect(() => {
    setCalendarPageData(dataToRender);
    if (isCityChanged) setIsCityChanged(false);
  }, [dataToRender]);

  // повторная загрузка при смене города
  useEffect(() => {
    if (currentUser && !isPageLoading) {
      setIsCityChanged(true);
      firstPageRender();
    }
  }, [currentUser?.city]);

  // Открытие попапа при переходе из поиска
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

  // подписка/отписка от ивентов
  const { handleEventBooking, selectedEvent, isWaitingResponse } =
    useEventBooking();
  useEffect(() => {
    if (selectedEvent) {
      setCalendarPageData(() =>
        calendarPageData.map((event) =>
          event.id === selectedEvent.id ? selectedEvent : event
        )
      );
    }
  }, [selectedEvent]);

  // глобальный лоадер при первой загрузке страницы
  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="calendar-page page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );

  // рендеринг
  // отрисовка заглушки
  function renderAnimatedContainer() {
    return (
      <AnimatedPageContainer
        titleText={
          isPageError
            ? ERROR_MESSAGES.generalErrorMessage.title
            : textStubNoData
        }
      />
    );
  }

  // отрисовка карточек ивентов
  function renderEventCardsContainer() {
    if (isPaginationUsed) {
      return <Loader isPaginate />;
    }

    return (
      <div className="calendar-page__grid">
        {calendarPageData.map((cardData) => (
          <CardCalendar
            key={cardData.id}
            cardData={cardData}
            onEventSignUpClick={handleEventBooking}
            onEventDescriptionClick={openPopupAboutEvent}
            sectionClass="scale-in"
            isWaitingResponse={isWaitingResponse}
            loadingEventId={
              isWaitingResponse
                ? getLocalStorageData(localStAfishaEvent)?.id
                : undefined
            }
          />
        ))}
      </div>
    );
  }

  // фильтры
  function renderFilters() {
    // если месяца больше 1 с учётом кнопки ВСЕ
    if (filters.length > 2) {
      return (
        <TagsList
          filterList={filters}
          name="month"
          handleClick={changeFilter}
        />
      );
    }
    return null;
  }

  // блок пагинации
  function renderPagination() {
    if (totalPages > 1) {
      return (
        <Paginate
          sectionClass="cards-section__pagination"
          pageCount={totalPages}
          value={pageIndex}
          onChange={changePageIndex}
        />
      );
    }
    return null;
  }

  function renderFiltersAndCards() {
    return (
      <>
        {renderFilters()}

        {isFiltersUsed ? (
          <Loader isPaginate />
        ) : (
          <>
            {renderEventCardsContainer()}
            {renderPagination()}
          </>
        )}
      </>
    );
  }

  // главная функция рендера
  function renderPageContent() {
    // залогинен и (ошибка или нет ивентов для города вообще)
    if (currentUser && (isPageError || calendarPageData?.length === 0)) {
      return renderAnimatedContainer();
    }

    // залогинен и есть ивенты
    if (currentUser) {
      return (
        <>
          <TitleH1 title={title} sectionClass="calendar-page__title" />
          <div className="calendar-page__container">
            {isCityChanged ? <Loader isPaginate /> : renderFiltersAndCards()}
          </div>
        </>
      );
    }

    return null;
  }
}

export default Calendar;
