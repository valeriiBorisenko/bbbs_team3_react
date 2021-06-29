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
// ну там будет запрос такого вида: /places/?mentor=1&tags=park,museum

function Places({ openPopupCities }) {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  // начальные места из API
  const [places, setPlaces] = useState([]);
  const [chosenPlace, setChosenPlace] = useState(null);

  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
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
    handleCheckboxBehavior(setAges, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  // функция, определяющая теги категорий в зависимости от того, есть ли рубрика "Выбор наставника"
  const defineCategories = (tags, chosenArr) => {
    const categoriesArray = tags.map((tag) => ({
      filter: tag?.slug,
      name: tag?.name[0].toUpperCase() + tag?.name.slice(1),
      isActive: false,
    }));
    const chosenFilter = {
      filter: mentorTag,
      name: mentorTag,
      isActive: false,
    };
    if (chosenArr.length > 0) {
      return [
        { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
        chosenFilter,
        ...categoriesArray,
      ];
    }
    return [
      { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
      ...categoriesArray,
    ];
  };

  // функция, определяющая места, отмеченые флагом "Выбор наставника"
  const defineChosenPlaces = (placesData) => {
    const chosenArr = placesData.filter((place) => place.chosen);
    const chosenLast = chosenArr[chosenArr.length - 1];
    return { chosenArr, chosenLast };
  };

  // функция-фильтратор
  const handleFiltration = () => {
    const activeAgeFilter = ages.filter((filter) => filter.isActive);
    console.log({ activeAgeFilter });
    const activeCategories = categories
      .filter(
        (filter) =>
          filter.isActive &&
          filter.filter !== ALL_CATEGORIES &&
          filter.filter !== mentorTag
      )
      .map((filter) => filter.filter)
      .join(',');
    console.log({ activeCategories });

    // ВСЕ
    if (activeCategories.length === 0) {
      if (activeAgeFilter.length === 0) {
        // + БЕЗ ВОЗРАСТА (по умолчанию)
        Api.getPlaces()
          .then((res) => {
            const { chosenLast } = defineChosenPlaces(res);
            setPlaces(res.filter((place) => place.id !== chosenLast.id));
            setChosenPlace(chosenLast);
          })
          .catch(console.log);
      } else {
        // + ВОЗРАСТ
        // const filterByAge = places.filter((place) =>
        //   filterAgeRanges(place.age, activeAgeFilter)
        // );
        // setFilteredPlaces(filterByAge);
      }

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ
    if (activeCategories.length > 0) {
      if (activeAgeFilter.length === 0) {
        // + БЕЗ ВОЗРАСТА
        Api.getFilteredPlaces(activeCategories)
          .then(setPlaces)
          .catch(console.log);
      } else {
        // + ВОЗРАСТ
        // const filterByAge = places.filter((place) =>
        //   filterAgeRanges(place.age, activeAgeFilter)
        // );
        // const filterByCategory = filterByAge.filter((place) =>
        //   activeCategories.includes(place.category)
        // );
        // setFilteredPlaces(filterByCategory);
      }

      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
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
        const { chosenArr, chosenLast } = defineChosenPlaces(placesData);
        setPlaces(placesData.filter((place) => place.id !== chosenLast.id));
        setChosenPlace(chosenLast);
        setCategories(defineCategories(tagsData, chosenArr));
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

      {chosenPlace && !isFiltersUsed && (
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
