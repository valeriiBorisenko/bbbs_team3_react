import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  useSingleCardAtDynamicRoute,
} from '../../hooks';
import {
  getChosenPlace,
  getPlaceById,
  getPlaces,
  getPlacesTags,
} from '../../api/places-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardPlace,
  Heading,
  Loader,
  NextArticleLink,
  NoDataNotificationBox,
  Paginate,
  PlacesRecommend,
  PopupRecommendSuccess,
  TagsList,
} from './index';
import './Places.scss';
import { Card } from '../Articles';
import { PLACES_URL } from '../../config/routes';

const {
  headTitle,
  headDescription,
  title,
  textStubNoData,
  paragraphNoContent,
  toMainPageLinkTitle,
} = placesPageTexts;

const PAGE_SIZE_PAGINATE = {
  small: 8,
  default: 12,
};

const MAX_SCREEN_WIDTH = {
  small: 1024,
};

function Places() {
  const { placeId } = useParams();
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
  const { pageSize } = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // стейт ошибки
  const [isPageError, setIsPageError] = useState(false);
  // попап страницы
  const [isPopupRecommendSuccessOpen, setIsPopupRecommendSuccessOpen] =
    useState(false);

  const openPopupRecommendSuccess = () => {
    setIsPopupRecommendSuccessOpen(true);
  };

  const closePopupRecommendSuccess = () => {
    setIsPopupRecommendSuccessOpen(false);
  };

  // одиночная карточка при переходе по динамическому маршруту
  const { singleCard, isSingleCardShown } = useSingleCardAtDynamicRoute({
    apiCallback: getPlaceById,
    dynamicParam: placeId,
    setIsPageError,
  });

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
    dontStartWhileTrue: !!placeId, // скрипты выполнятся, только если нет запроса по id
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
  }, []);

  // повторная загрузка при смене города
  useEffect(() => {
    if (!isPageLoading && !placeId) {
      setIsCityChanged(true);
      resetStatesAndGetNewData();
    }
  }, [userCity]);

  // следит за изменением данных, если это было вызвано сменой города
  useEffect(() => {
    if (isCityChanged && !placeId) setIsCityChanged(false);
  }, [dataToRender]);

  if (isPageLoading || (placeId && !isSingleCardShown)) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        <section className="places page__section">
          {renderPageContent()}
        </section>
      </BasePage>
      <PopupRecommendSuccess
        isOpen={isPopupRecommendSuccessOpen}
        onClose={closePopupRecommendSuccess}
      />
    </>
  );

  function renderPageContent() {
    // ошибка или нет ивентов для города вообще и не фильтровали
    if (
      isPageError ||
      (!isMainCard && !dataToRender.length && !placeId && !isNoFilteredResults)
    ) {
      return renderAnimatedContainer();
    }

    return (
      <>
        <Heading
          level={1}
          type="big"
          content={title}
          sectionClass="places__title fade-in"
        />
        {renderFiltersAndCards()}
      </>
    );
  }

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

  function renderFiltersAndCards() {
    if (isSingleCardShown) {
      return (
        <div className="places__single-card-container scale-in">
          <CardPlace
            data={singleCard}
            activityTypesSimplified={activityTypesSimplified}
            sectionClass="card-container_type_main-article"
            isBig
          />

          <Card sectionClass="places__single-card-paragraph">
            <p className="paragraph">{singleCard.description}</p>
          </Card>

          <NextArticleLink text={toMainPageLinkTitle} href={PLACES_URL} />
        </div>
      );
    }

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
                key={mainCard.id}
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
                  key={place.id}
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

  function renderFilters() {
    // учитываем также кннопку ВСЕ
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
    if (!placeId) {
      return (
        <TagsList
          filterList={ageFilters}
          name="ages"
          handleClick={changeAgeFilter}
          sectionClass="places__tags fade-in"
        />
      );
    }
    return null;
  }
}

export default Places;
