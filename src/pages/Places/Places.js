import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import placesPageTexts from './locales/RU';
import { CurrentUserContext, PopupsContext } from '../../contexts';
import {
  COLORS,
  DELAY_RENDER,
  ERROR_MESSAGES,
  localStUserCity,
} from '../../config/constants';
import {
  useActivityTypes,
  useFiltrationForPlaces,
  useLocalStorage,
  usePageWidth,
} from '../../hooks';
import {
  getChosenPlace,
  getPlace,
  getPlaces,
  getPlacesTags,
} from '../../api/places-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardPlace,
  Loader,
  NoDataNotificationBox,
  Paginate,
  PlacesRecommend,
  PopupPlace,
  PopupRecommendSuccess,
  TagsList,
  TitleH1,
} from './index';
import './Places.scss';

const {
  headTitle,
  headDescription,
  title,
  textStubNoData,
  paragraphNoContent,
} = placesPageTexts;

const PAGE_SIZE_PAGINATE = {
  small: 8,
  default: 12,
};

const MAX_SCREEN_WIDTH = {
  small: 1024,
};

function Places() {
  const { state } = useLocation();
  const searchPlaceId = state?.id;
  const [searchedPlace, setSearchedPlace] = useState({});

  const { activityTypes, activityTypesSimplified } = useActivityTypes();

  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupCities } = useContext(PopupsContext);

  const getLocalStorageItem = useLocalStorage(localStUserCity);

  // сохранённый в localStorage город анонимуса
  const currentAnonymousCity = getLocalStorageItem();
  const userCity = currentUser?.city ?? currentAnonymousCity;
  // флаг смены города - нужно снова загружать данные
  const [isCityChanged, setIsCityChanged] = useState(false);

  // определяет, сколько карточек показывать на странице в зависимости от ширины экрана
  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // стейт ошибки
  const [isPageError, setIsPageError] = useState(false);
  // попапы страницы
  const [isPlacePopupOpen, setIsPlacePopupOpen] = useState(false);
  const [isPopupRecommendSuccessOpen, setIsPopupRecommendSuccessOpen] =
    useState(false);

  const openPopupPlace = () => {
    setIsPlacePopupOpen(true);
  };

  const closePopupPlace = () => {
    setIsPlacePopupOpen(false);
  };

  const openPopupRecommendSuccess = () => {
    setIsPopupRecommendSuccessOpen(true);
  };

  const closePopupRecommendSuccess = () => {
    setIsPopupRecommendSuccessOpen(false);
  };

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getPlaces,
    apiGetFiltersCallback: getPlacesTags,
    apiGetMainCardCallback: getChosenPlace,
    apiFilterNames: {
      tags: 'tags',
      chosen: 'chosen',
      ageRestriction: 'age_restriction',
    },
    userCity,
    pageSize,
    setIsPageError,
  };

  const {
    dataToRender,
    filters,
    ageFilters,
    mainCard,
    isMainCard,
    isMainCardShown,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    isNoFilteredResults,
    isFormRecommendationShown,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
    changeAgeFilter,
    resetStatesAndGetNewData,
  } = useFiltrationForPlaces(filtersAndPaginationSettings);

  useEffect(() => {
    if (!userCity) {
      setTimeout(() => {
        openPopupCities();
      }, DELAY_RENDER);
    }

    if (state && userCity) {
      getPlace(searchPlaceId)
        .then((place) => {
          setSearchedPlace(place);
          openPopupPlace();
        })
        .catch(() => setIsPageError(true));
    }
  }, [state]);

  // повторная загрузка при смене города
  useEffect(() => {
    if (!isPageLoading) {
      setIsCityChanged(true);
      resetStatesAndGetNewData();
    }
  }, [userCity]);

  // следит за изменением данных, если это было вызвано сменой города
  useEffect(() => {
    if (isCityChanged) setIsCityChanged(false);
  }, [dataToRender]);

  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        <section className="places page__section">
          {renderPageContent()}
        </section>
      </BasePage>
      <PopupPlace
        isOpen={isPlacePopupOpen}
        onClose={closePopupPlace}
        place={searchedPlace}
        activityTypesSimplified={activityTypesSimplified}
      />
      <PopupRecommendSuccess
        isOpen={isPopupRecommendSuccessOpen}
        onClose={closePopupRecommendSuccess}
      />
    </>
  );

  // функции рендера
  function renderAnimatedContainer() {
    return (
      <>
        <AnimatedPageContainer
          titleText={
            isPageError
              ? ERROR_MESSAGES.generalErrorMessage.title
              : textStubNoData
          }
        />
        {currentUser && !isPageError && (
          <PlacesRecommend activityTypes={activityTypes} />
        )}
      </>
    );
  }

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

  function renderPlaces() {
    if (isNoFilteredResults) {
      return (
        <NoDataNotificationBox
          text={paragraphNoContent}
          isAnimated
          sectionClass="no-data-text_padding-top"
        />
      );
    }

    if (isMainCard || dataToRender.length > 0) {
      return (
        <>
          {isMainCard && isMainCardShown && (
            <section className="places__main">
              <CardPlace
                key={mainCard?.id}
                data={mainCard}
                activityTypesSimplified={activityTypesSimplified}
                sectionClass="card-container_type_main-article scale-in"
                isBig
              />
            </section>
          )}

          {!isPaginationUsed ? (
            <section className="places__cards-grid">
              {dataToRender.map((place, i) => (
                <CardPlace
                  key={place?.id}
                  data={place}
                  activityTypesSimplified={activityTypesSimplified}
                  color={COLORS[(i + 1) % COLORS.length]}
                  sectionClass="card-container_type_article scale-in"
                />
              ))}
            </section>
          ) : (
            <Loader isPaginate />
          )}
          {renderPagination()}
        </>
      );
    }
    return null;
  }

  function renderFilters() {
    // если фильтров больше 1 с учётом кнопки ВСЕ
    if (filters.length > 2) {
      return (
        <TagsList
          filterList={filters}
          name="categories"
          handleClick={changeFilter}
          sectionClass="fade-in"
        />
      );
    }
    return null;
  }

  function renderAgeFilters() {
    return (
      <TagsList
        filterList={ageFilters}
        name="ages"
        handleClick={changeAgeFilter}
        sectionClass="places__tags fade-in"
      />
    );
  }

  function renderFiltersAndCards() {
    if (isCityChanged) {
      return <Loader isPaginate />;
    }

    return (
      <>
        {renderFilters()}
        {renderAgeFilters()}
        {currentUser && isFormRecommendationShown && !isFiltersUsed && (
          <PlacesRecommend
            activityTypes={activityTypes}
            openSuccessPopup={openPopupRecommendSuccess}
          />
        )}
        {isFiltersUsed ? <Loader isPaginate /> : renderPlaces()}
      </>
    );
  }

  function renderPageContent() {
    // ошибка или нет ивентов для города вообще и ничего не фильтровали
    if (
      isPageError ||
      (!isMainCard && dataToRender.length === 0 && !isNoFilteredResults)
    ) {
      return renderAnimatedContainer();
    }

    return (
      <>
        <TitleH1 title={title} sectionClass="places__title fade-in" />
        {renderFiltersAndCards()}
      </>
    );
  }
}

export default Places;
