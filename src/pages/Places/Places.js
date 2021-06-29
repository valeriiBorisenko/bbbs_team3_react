/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
import './Places.scss';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useScrollToTop } from '../../hooks/index';
import { COLORS, ALL_CATEGORIES } from '../../config/constants';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  handleRadioBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { BasePage, TitleH1, CardPlace, PlacesRecommend } from './index';
import Api from '../../utils/api';

const ageFilters = [
  { filter: '8-10 лет', name: '8-10 лет', isActive: false, range: [8, 10] },
  { filter: '11-13 лет', name: '11-13 лет', isActive: false, range: [11, 13] },
  { filter: '14-18 лет', name: '14-18 лет', isActive: false, range: [14, 18] },
  { filter: '18+ лет', name: '18+ лет', isActive: false, range: [18, 18] },
];

const mentorTag = 'Выбор наставников';

function Places({ openPopupCities }) {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  // места из API
  const [places, setPlaces] = useState([]);
  const [chosenPlace, setChosenPlace] = useState(null);

  // флаг применения фильтров для useEffect
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // видна ли главная карточка
  const [isChosenCardHidden, setIsChosenCardHidden] = useState(false);
  // категории фильтрации
  const [ages, setAges] = useState(ageFilters); // состояние кнопок фильтра возраста
  const [categories, setCategories] = useState([]); // состояние кнопок фильтра категорий

  // хэндлер клика по фильтру
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
  const defineCategories = (tags, chosenPlaces) => {
    const categoriesArray = tags.map((tag) => ({
      filter: tag?.slug.toLowerCase(),
      name: tag?.name[0].toUpperCase() + tag?.name.slice(1),
      isActive: false,
    }));
    if (chosenPlaces.length > 0) {
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
  // chosenLast - самая "свежая" карточка "Выбор наставника"
  // restOfPlaces - массив без этой карточки
  const definePlaces = (placesData) => {
    const chosenPlaces = placesData.filter((place) => place.chosen);
    const chosenLast = chosenPlaces[chosenPlaces.length - 1];
    const restOfPlaces = placesData.filter(
      (place) => place.id !== chosenLast.id
    );
    return { chosenPlaces, chosenLast, restOfPlaces };
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
        Api.getPlaces()
          .then((res) => {
            const { restOfPlaces, chosenLast } = definePlaces(res);
            setChosenPlace(chosenLast);
            setPlaces(restOfPlaces);
            setIsChosenCardHidden(false);
          })
          .catch(console.log);
      } else {
        // + ВОЗРАСТ
        Api.getPlacesByCategories({
          min_age: ageFilter.range[0],
          max_age: ageFilter.range[1],
        })
          .then((res) => {
            setPlaces(res);
            setIsChosenCardHidden(true);
          })
          .catch(console.log);
      }

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ + ВОЗРАСТ (или без него)
    if (activeCategories.length > 0) {
      Api.getPlacesByCategories({
        chosen: isMentorFlag,
        tags: activeTags,
        min_age: ageFilter?.range[0],
        max_age: ageFilter?.range[1],
      })
        .then((res) => {
          setPlaces(res);
          setIsChosenCardHidden(true);
        })
        .catch(console.log);
    }

    deselectOneTag(setCategories, ALL_CATEGORIES);
  };

  // запуск фильтрации
  useEffect(() => {
    handleFiltration();
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
    Promise.all([Api.getPlaces(), Api.getPlacesTags()])
      .then(([placesData, tagsData]) => {
        const { chosenPlaces, chosenLast, restOfPlaces } =
          definePlaces(placesData);
        setChosenPlace(chosenLast);
        setPlaces(restOfPlaces);
        setCategories(defineCategories(tagsData, chosenPlaces));
      })
      .catch(console.log);
  }, [currentUser?.city]);

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
        <TitleH1 title="Куда пойти" />
        <div className="tags">
          <ul className="tags__list">
            {renderFilterTags(categories, 'category', changeCategory)}
          </ul>
          <ul className="tags__list">
            {renderFilterTags(ages, 'age', changeAge)}
          </ul>
        </div>
      </section>

      {currentUser && <PlacesRecommend />}

      {chosenPlace && !isChosenCardHidden && (
        <section className="place__main page__section fade-in">
          <CardPlace
            key={chosenPlace?.id}
            data={chosenPlace}
            sectionClass="card-container_type_main-article"
            isBig
          />
        </section>
      )}

      <section className="place__cards-grid page__section">
        {places.map((place, i) => (
          <CardPlace
            data={place}
            key={place?.id}
            color={COLORS[i % COLORS.length]}
            sectionClass="card-container_type_article fade-in"
          />
        ))}
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
