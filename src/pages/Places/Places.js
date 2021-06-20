import './Places.scss';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useScrollToTop } from '../../hooks/index';
import { repeatSchema } from '../../utils/utils';
import { COLORS, ALL_CATEGORIES } from '../../config/constants';
import {
  renderFilterTags, handleCheckboxBehavior, handleRadioBehavior, selectOneTag, deselectOneTag
} from '../../utils/filter-tags';
import {
  BasePage,
  TitleH1,
  CardPlace,
  PlacesRecommend
} from './index';
import Api from '../../utils/api';

const ageFilters = [
  { filter: '8-10 лет', name: '8-10 лет', isActive: false },
  { filter: '11-13 лет', name: '11-13 лет', isActive: false },
  { filter: '14-18 лет', name: '14-18 лет', isActive: false },
  { filter: '18+ лет', name: '18+ лет', isActive: false }
];

function Places({ openPopupCities }) {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  // начальные места из API
  const [places, setPlaces] = useState([]);

  // мутабельный массив для применения фильтров
  const [filteredPlaces, setFilteredPlaces] = useState([]);
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
    handleRadioBehavior(setAges, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  // вспомогательная функция-фильтровщик возраста
  const filterAgeRanges = (age, activeAge) => {
    switch (activeAge.filter) {
      case ageFilters[0].filter:
        return age >= 8 && age <= 10;
      case ageFilters[1].filter:
        return age >= 11 && age <= 13;
      case ageFilters[2].filter:
        return age >= 14 && age < 18;
      case ageFilters[3].filter:
        return age >= 18;
      default:
        return age;
    }
  };

  // функция-фильтратор
  const handleFiltration = () => {
    const activeAgeFilter = ages.find((filter) => filter.isActive);
    const activeCategories = categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.filter);

    // ВСЕ
    if (activeCategories.length === 0) {
      if (!activeAgeFilter) {
        // + БЕЗ ВОЗРАСТА (по умолчанию)
        setFilteredPlaces(places);
      } else {
        // + ВОЗРАСТ
        const filterByAge = places.filter((place) => filterAgeRanges(place.age, activeAgeFilter));
        setFilteredPlaces(filterByAge);
      }

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ
    if (activeCategories.length > 0) {
      if (!activeAgeFilter) {
        // + БЕЗ ВОЗРАСТА
        const filterByCategory = places
          .filter((place) => activeCategories.includes(place.category));
        setFilteredPlaces(filterByCategory);
      } else {
        // + ВОЗРАСТ
        const filterByAge = places.filter((place) => filterAgeRanges(place.age, activeAgeFilter));
        const filterByCategory = filterByAge
          .filter((place) => activeCategories.includes(place.category));

        setFilteredPlaces(filterByCategory);
      }

      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  // запуск фильтрации
  useEffect(() => {
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // АПИ
  useEffect(() => {
    Api.getPlaces()
      .then((result) => {
        setPlaces(result);
        setFilteredPlaces(result);

        const categoriesArr = result.map((place) => place.category);
        const set = new Set(categoriesArr);
        const uniqueCategories = Array.from(set)
          .map((item) => ({ filter: item, name: item, isActive: false }));
        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...uniqueCategories
        ]);
      })
      .catch(console.log);
  }, []);

  // открытие попапа "города" для незарегистрированного
  useEffect(() => {
    if (!currentUser) {
      openPopupCities();
    }
  }, []);

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

      {currentUser && (<PlacesRecommend />)}

      <section className="place__main page__section fade-in">
        <CardPlace
          key={places.find((place) => place.chosen)?.id}
          data={places.find((place) => place.chosen)}
          sectionClass="card-container_type_main-article"
          isMain
        />
      </section>

      <section className="place__cards-grid page__section">
        {filteredPlaces.map((place, idx) => (
          <CardPlace
            data={place}
            key={place.id}
            color={repeatSchema(idx, places.length, COLORS)}
            sectionClass="card-container_type_article fade-in"
          />
        ))}
      </section>
    </BasePage>
  );
}

Places.propTypes = {
  openPopupCities: PropTypes.func
};

Places.defaultProps = {
  openPopupCities: () => {}
};

export default Places;
