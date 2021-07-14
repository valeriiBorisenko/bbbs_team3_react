/* eslint-disable no-unused-vars */
import './Places.scss';
import { useEffect, useState, useContext } from 'react';
import placesPageTexts from '../../locales/places-page-RU';
import { ageFilters, PAGE_SIZE_PAGINATE } from './constants';
import { CurrentUserContext, PopupsContext } from '../../contexts/index';
import {
  useDebounce,
  useActivityTypes,
  useLocalStorage,
} from '../../hooks/index';
import {
  COLORS,
  ALL_CATEGORIES,
  DELAY_DEBOUNCE,
  DELAY_RENDER,
  localStUserCity,
} from '../../config/constants';
import {
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
  deselectAllTags,
} from '../../utils/filter-tags';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import {
  BasePage,
  TitleH1,
  CardPlace,
  PlacesRecommend,
  AnimatedPageContainer,
  Loader,
  TagsList,
  NoDataNotificationBox,
  Paginate,
} from './index';
import { getPlaces, getPlacesTags } from '../../api/places-page';

const {
  headTitle,
  headDescription,
  title,
  textStubNoData,
  paragraphNoContent,
  mentorTag,
} = placesPageTexts;

function Places() {
  const activityTypes = useActivityTypes();

  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupCities } = useContext(PopupsContext);

  const getLocalStorageItem = useLocalStorage(localStUserCity);

  // сохранённый в localStorage город анонимуса
  const currentAnonymousCity = getLocalStorageItem();
  const userCity = currentUser?.city || currentAnonymousCity;

  // места из API
  const [places, setPlaces] = useState(null);
  const [chosenPlace, setChosenPlace] = useState(null);

  // переход между фильтрами, лоадер
  const [isLoading, setIsLoading] = useState(false);
  // переход между городами, лоадер
  const [isCityChanging, setIsCityChanging] = useState(false);
  // триггер фильтра для useEffect
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // видна ли главная карточка
  const [isChosenCardHidden, setIsChosenCardHidden] = useState(false);
  // стейт для определения первой отрисовки страницы (нужен при фильтрации)
  const [isFirstRender, setIsFirstRender] = useState(true);
  // категории фильтрации
  const [ages, setAges] = useState(ageFilters); // состояние кнопок фильтра возраста
  const [categories, setCategories] = useState([]); // состояние кнопок фильтра категорий

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // Резайз пагинации при первой загрузке
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1024px)');
    const largeQuery = window.matchMedia('(max-width: 1279px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.small);
      } else if (largeQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.medium);
      } else {
        setPageSize(PAGE_SIZE_PAGINATE.big);
      }
    };
    listener();

    smallQuery.addEventListener('change', listener);
    largeQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
      largeQuery.removeEventListener('change', listener);
    };
  }, []);

  // хэндлер клика по фильтру КАТЕГОРИИ
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
      deselectAllTags(setAges);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    }
    setIsFiltersUsed(true);
  };

  // хэндлер клика по фильтру ВОЗРАСТ
  const changeAge = (inputValue, isChecked) => {
    handleCheckboxBehavior(setAges, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  // функция, определяющая теги категорий в зависимости от того, есть ли рубрика "Выбор наставника"
  const defineCategories = (tags, chosenPlaceLast) => {
    const categoriesArray = tags.map((tag) => ({
      filter: tag?.slug.toLowerCase(),
      name: changeCaseOfFirstLetter(tag?.name),
      isActive: false,
    }));
    if (chosenPlaceLast) {
      return [
        { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
        { filter: mentorTag, name: mentorTag, isActive: false },
        ...categoriesArray,
      ];
    }
    return [
      { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
      ...categoriesArray,
    ];
  };

  // функция, определяющая карточки по флагу "Выбор наставника"
  // chosenPlaceLast - самая "свежая" карточка "Выбор наставника"
  // restOfPlaces - массив без этой карточки
  const definePlaces = (placesData, isFiltered) => {
    const allPlaces = placesData;
    let chosenPlaces;
    let restOfPlaces;
    let chosenPlaceLast;

    if (pageNumber === 0 && !isFiltered) {
      chosenPlaces = allPlaces.filter((place) => place?.chosen);
      chosenPlaceLast = chosenPlaces[chosenPlaces.length - 1];
    }

    if (!chosenPlaceLast && pageNumber === 0 && !isFiltered) {
      allPlaces.pop();
      restOfPlaces = allPlaces;
    } else {
      restOfPlaces = allPlaces.filter(
        (place) => place?.id !== chosenPlaceLast?.id
      );
    }

    return { chosenPlaceLast, restOfPlaces };
  };

  const defineActiveTags = () => {
    const activeCategories = categories.filter(
      (category) => category.isActive && category.filter !== ALL_CATEGORIES
    );

    const activeTags = activeCategories
      .filter((tag) => tag.filter !== mentorTag)
      .map((tag) => tag.filter)
      .join(',');

    const activeAges = ages
      .filter((age) => age.isActive)
      .map((age) => age.filter)
      .join(',');

    const isMentorFlag = activeCategories.some(
      (tag) => tag.filter === mentorTag
    );

    return {
      activeCategories,
      activeTags,
      activeAges,
      isMentorFlag,
    };
  };
  console.log(chosenPlace);

  // запрос отфильтрованного массива карточек
  const getFilteredPlaces = (params, isFiltered) => {
    const offset = pageSize * pageNumber;
    const fixedPageSize =
      pageNumber === 0 && !isFiltered ? pageSize + 1 : pageSize;
    const fixedOffset =
      pageNumber > 0 && chosenPlace && !isFiltered ? offset + 1 : offset;

    getPlaces({ limit: fixedPageSize, offset: fixedOffset, ...params })
      .then(({ results, count }) => {
        setPageCount(Math.ceil(count / pageSize));
        const { restOfPlaces } = definePlaces(results, isFiltered);
        if (pageNumber > 0 || isFiltered) {
          setIsChosenCardHidden(true);
        }
        setPlaces(restOfPlaces);
      })
      .catch(console.log)
      .finally(() => setIsLoading(false));
  };

  // функция-фильтратор
  const handleFiltration = () => {
    const { activeCategories, activeTags, activeAges, isMentorFlag } =
      defineActiveTags();

    // ВСЕ
    if (activeCategories.length === 0) {
      if (activeAges.length === 0) {
        // + БЕЗ ВОЗРАСТА (по умолчанию)
        getFilteredPlaces(
          {
            city: userCity,
          },
          false
        );
        setIsChosenCardHidden(false);
      } else {
        // + ВОЗРАСТ
        getFilteredPlaces(
          {
            age_restriction: activeAges,
            city: userCity,
          },
          true
        );
      }

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ + ВОЗРАСТ (или без него)
    if (activeCategories.length > 0) {
      getFilteredPlaces(
        {
          chosen: isMentorFlag,
          tags: activeTags,
          age_restriction: activeAges,
          city: userCity,
        },
        true
      );
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  // запуск фильтрации/пагинации
  useEffect(() => {
    if (!isFirstRender && (isFiltersUsed || pageNumber >= 0)) {
      setIsLoading(true);
      debounceFiltration();
    }
    setIsFirstRender(false);
    setIsFiltersUsed(false);
  }, [isFiltersUsed, pageSize, pageNumber]);

  // Promise.all нужен для формирования тега "Выбор наставников" по метке на карточках
  useEffect(() => {
    if (userCity && pageSize) {
      deselectAllTags(setAges);

      setIsCityChanging(true);

      Promise.all([
        getPlaces({
          city: userCity,
          limit: pageSize + 1,
        }),
        getPlacesTags(),
      ])
        .then(([{ results, count }, tagsData]) => {
          setPageCount(Math.ceil(count / pageSize));
          const { chosenPlaceLast, restOfPlaces } = definePlaces(results);
          setChosenPlace(chosenPlaceLast);
          setPlaces(restOfPlaces);
          setCategories(defineCategories(tagsData, chosenPlaceLast));
          setIsChosenCardHidden(false);
        })
        .catch(console.log)
        .finally(() => setIsCityChanging(false));
    }
  }, [userCity, pageSize]);

  useEffect(() => {
    if (!userCity) {
      setTimeout(() => {
        openPopupCities();
      }, DELAY_RENDER);
    }
  }, []);

  // функции рендера
  const renderPlaces = () => {
    if (places?.length > 0) {
      return (
        <>
          {chosenPlace && !isChosenCardHidden && (
            <section className="places__main">
              <CardPlace
                key={chosenPlace?.id}
                data={chosenPlace}
                activityTypes={activityTypes}
                sectionClass="card-container_type_main-article scale-in"
                isBig
              />
            </section>
          )}

          <section className="places__cards-grid">
            {places.map((place, i) => (
              <CardPlace
                key={place?.id}
                data={place}
                activityTypes={activityTypes}
                color={COLORS[i % COLORS.length]}
                sectionClass="card-container_type_article scale-in"
              />
            ))}
          </section>
        </>
      );
    }
    return (
      <NoDataNotificationBox
        text={paragraphNoContent}
        sectionClass="no-data-text_padding-top"
      />
    );
  };

  const renderAnimatedContainer = () => (
    <>
      {!isCityChanging ? (
        <>
          <AnimatedPageContainer titleText={textStubNoData} />
          {currentUser && <PlacesRecommend activityTypes={activityTypes} />}
        </>
      ) : (
        <Loader isNested />
      )}
    </>
  );

  function renderPagination() {
    if (pageCount > 1) {
      return (
        <Paginate
          sectionClass="cards-section__pagination"
          pageCount={pageCount}
          value={pageNumber}
          onChange={setPageNumber}
        />
      );
    }
    return null;
  }

  const renderPageContent = () => {
    if (isFirstRender && places?.length === 0) {
      return renderAnimatedContainer();
    }
    return (
      <>
        <TitleH1 title={title} sectionClass="places__title" />
        {!isCityChanging ? (
          <>
            <TagsList
              filterList={categories}
              name="categories"
              handleClick={changeCategory}
            />
            <TagsList
              filterList={ages}
              name="ages"
              handleClick={changeAge}
              sectionClass="places__tags"
            />
            {currentUser && <PlacesRecommend activityTypes={activityTypes} />}

            {!isLoading ? renderPlaces() : <Loader isNested />}
            {renderPagination()}
          </>
        ) : (
          <Loader isNested />
        )}
      </>
    );
  };

  if (!places) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="places page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

export default Places;
