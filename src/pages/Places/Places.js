import './Places.scss';
import { useEffect, useState, useContext } from 'react';
import placesPageTexts from '../../locales/places-page-RU';
import ageFilters from './constants';
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
  // стейт для определения первой отрисовки страницы
  const [isFirstRender, setIsFirstRender] = useState(false);
  // категории фильтрации
  const [ages, setAges] = useState(ageFilters); // состояние кнопок фильтра возраста
  const [categories, setCategories] = useState([]); // состояние кнопок фильтра категорий

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
  const definePlaces = (placesData) => {
    const chosenPlaces = placesData.filter((place) => place?.chosen);
    const chosenPlaceLast = chosenPlaces[chosenPlaces.length - 1];
    const restOfPlaces = chosenPlaceLast
      ? placesData.filter((place) => place?.id !== chosenPlaceLast?.id)
      : placesData;
    return { chosenPlaceLast, restOfPlaces };
  };

  // функция-фильтратор
  const handleFiltration = () => {
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

    // ВСЕ
    if (activeCategories.length === 0) {
      if (activeAges.length === 0) {
        // + БЕЗ ВОЗРАСТА (по умолчанию)
        getPlaces({ city: userCity })
          .then((placesData) => {
            const { chosenPlaceLast, restOfPlaces } = definePlaces(placesData);
            setChosenPlace(chosenPlaceLast);
            setPlaces(restOfPlaces);
            setIsChosenCardHidden(false);
          })
          .catch(console.log)
          .finally(() => setIsLoading(false));
      } else {
        // + ВОЗРАСТ
        getPlaces({
          age_restriction: activeAges,
          city: userCity,
        })
          .then((placesData) => {
            setPlaces(placesData);
            setIsChosenCardHidden(true);
          })
          .catch(console.log)
          .finally(() => setIsLoading(false));
      }

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ + ВОЗРАСТ (или без него)
    if (activeCategories.length > 0) {
      getPlaces({
        chosen: isMentorFlag,
        tags: activeTags,
        age_restriction: activeAges,
        city: userCity,
      })
        .then((placesData) => {
          setPlaces(placesData);
          setIsChosenCardHidden(true);
        })
        .catch(console.log)
        .finally(() => setIsLoading(false));
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  // запуск фильтрации
  useEffect(() => {
    if (isFiltersUsed) {
      setIsLoading(true);
      debounceFiltration();
    }
    setIsFiltersUsed(false);
    setIsFirstRender(false);
  }, [isFiltersUsed]);

  // Promise.all нужен для формирования тега "Выбор наставников" по метке на карточках
  useEffect(() => {
    if (userCity) {
      deselectAllTags(setAges);
      setIsFirstRender(true);
      setIsCityChanging(true);
      Promise.all([getPlaces({ city: userCity }), getPlacesTags()])
        .then(([placesData, tagsData]) => {
          const { chosenPlaceLast, restOfPlaces } = definePlaces(placesData);
          setChosenPlace(chosenPlaceLast);
          setPlaces(restOfPlaces);
          setCategories(defineCategories(tagsData, chosenPlaceLast));
          setIsChosenCardHidden(false);
        })
        .catch(console.log)
        .finally(() => setIsCityChanging(false));
    }
  }, [userCity]);

  useEffect(() => {
    if (!userCity) {
      setTimeout(() => {
        openPopupCities();
      }, DELAY_RENDER);
    }
  }, []);

  const renderPlaces = () => {
    if (places?.length > 0) {
      return (
        <>
          {chosenPlace && !isChosenCardHidden && (
            <section className="places__main fade-in">
              <CardPlace
                key={chosenPlace?.id}
                data={chosenPlace}
                activityTypes={activityTypes}
                sectionClass="card-container_type_main-article"
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
                sectionClass="card-container_type_article fade-in"
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

            {!isLoading ? <>{renderPlaces()}</> : <Loader isNested />}
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
