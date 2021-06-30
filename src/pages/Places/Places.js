/* eslint-disable no-unused-vars */
import './Places.scss';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useScrollToTop, useDebounce } from '../../hooks/index';
import { COLORS, ALL_CATEGORIES, DELAY_DEBOUNCE } from '../../config/constants';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  handleRadioBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import {
  BasePage,
  TitleH1,
  CardPlace,
  PlacesRecommend,
  AnimatedPageContainer,
} from './index';
import Api from '../../utils/api';
import { Loader } from '../Calendar';

const ageFilters = [
  { filter: '8-10 лет', name: '8-10 лет', isActive: false, range: [8, 10] },
  { filter: '11-13 лет', name: '11-13 лет', isActive: false, range: [11, 13] },
  { filter: '14-18 лет', name: '14-18 лет', isActive: false, range: [14, 18] },
  { filter: '18+ лет', name: '18+ лет', isActive: false, range: [18, 100] },
];

const mentorTag = 'Выбор наставников';

function Places({ openPopupCities }) {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  // места из API
  const [places, setPlaces] = useState(null);
  const [chosenPlace, setChosenPlace] = useState(null);

  // переход между фильтрами, лоадер
  const [isLoading, setIsLoading] = useState(false);
  // переход между городами, лоадер
  const [isCityChanging, setIsCityChanging] = useState(false);

  // триггер для useEffect
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // видна ли главная карточка
  const [isChosenCardHidden, setIsChosenCardHidden] = useState(false);
  // категории фильтрации
  const [ages, setAges] = useState(ageFilters); // состояние кнопок фильтра возраста
  const [categories, setCategories] = useState([]); // состояние кнопок фильтра категорий

  // хэндлер клика по фильтру КАТЕГОРИИ
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    }
    setIsFiltersUsed(true);
  };

  // хэндлер клика по фильтру ВОЗРАСТ
  const changeAge = (inputValue, isChecked) => {
    handleRadioBehavior(setAges, { inputValue, isChecked });
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

  // запрос на все места
  const getAllPlaces = () => {
    setIsCityChanging(true);
    Promise.all([Api.getPlaces({}), Api.getPlacesTags()])
      .then(([placesData, tagsData]) => {
        const { chosenPlaceLast, restOfPlaces } = definePlaces(placesData);
        setChosenPlace(chosenPlaceLast);
        setPlaces(restOfPlaces);
        setCategories(defineCategories(tagsData, chosenPlaceLast));
        setIsChosenCardHidden(false);
      })
      .catch(console.log)
      .finally(() => {
        setIsLoading(false);
        setIsCityChanging(false);
      });
  };

  // функция-фильтратор
  const handleFiltration = () => {
    const ageFilter = ages.find((filter) => filter.isActive);

    const activeCategories = categories.filter(
      (category) => category.isActive && category.filter !== ALL_CATEGORIES
    );

    const activeTags = activeCategories
      .filter((tag) => tag.filter !== mentorTag)
      .map((tag) => tag.filter)
      .join(',');

    const isMentorFlag = activeCategories.some(
      (tag) => tag.filter === mentorTag
    );

    // ВСЕ
    if (activeCategories.length === 0) {
      if (!ageFilter) {
        // + БЕЗ ВОЗРАСТА (по умолчанию)
        setIsLoading(true);
        getAllPlaces();
      } else {
        // + ВОЗРАСТ
        setIsLoading(true);
        Api.getPlaces({
          min_age: ageFilter.range[0],
          max_age: ageFilter.range[1],
        })
          .then((res) => {
            setPlaces(res);
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
      setIsLoading(true);
      Api.getPlaces({
        chosen: isMentorFlag,
        tags: activeTags,
        min_age: ageFilter?.range[0],
        max_age: ageFilter?.range[1],
      })
        .then((res) => {
          setPlaces(res);
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
    if (isFiltersUsed) debounceFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // открытие попапа "города" для незарегистрированного
  useEffect(() => {
    if (!currentUser) {
      openPopupCities();
    }
  }, []);

  // АПИ
  useEffect(() => {
    getAllPlaces();
  }, [currentUser?.city]);

  // функции рендера
  const renderTags = () => (
    <div className="tags">
      <ul className="tags__list">
        {renderFilterTags(categories, 'category', changeCategory)}
      </ul>
      <ul className="tags__list">{renderFilterTags(ages, 'age', changeAge)}</ul>
    </div>
  );

  const renderPlaces = () => (
    <>
      {chosenPlace && !isChosenCardHidden && (
        <section className="place__main fade-in">
          <CardPlace
            key={chosenPlace?.id}
            data={chosenPlace}
            sectionClass="card-container_type_main-article"
            isBig
          />
        </section>
      )}

      <section className="place__cards-grid">
        {places.map((place, i) => (
          <CardPlace
            data={place}
            key={place?.id}
            color={COLORS[i % COLORS.length]}
            sectionClass="card-container_type_article fade-in"
          />
        ))}
      </section>
    </>
  );

  const renderAnimatedContainer = () => (
    <>
      {!isCityChanging ? (
        <>
          <AnimatedPageContainer
            titleText="Рекомендуемых мест для вашего города ещё нет, но они обязательно появятся!"
            buttonText="Вернуться на главную"
          />
          {currentUser && <PlacesRecommend />}
        </>
      ) : (
        <Loader isNested />
      )}
    </>
  );

  const renderPageContent = () => {
    if (places?.length === 0) {
      return renderAnimatedContainer();
    }
    return (
      <>
        <TitleH1 title="Куда пойти" />
        {!isCityChanging ? (
          <>
            {renderTags()}
            {currentUser && <PlacesRecommend />}

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
    <BasePage>
      <Helmet>
        <title>Куда пойти</title>
        <meta
          name="description"
          content="Куда вы можете пойти, что рекомендуют наши наставники"
        />
      </Helmet>
      <section className="place page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

Places.propTypes = {
  openPopupCities: PropTypes.func,
};

Places.defaultProps = {
  openPopupCities: () => {},
};

export default Places;
