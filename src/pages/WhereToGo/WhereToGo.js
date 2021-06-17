import './WhereToGo.scss';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import { repeatSchema } from '../../utils/utils';
import { COLORS, ALL_CATEGORIES } from '../../config/constants';
import {
  renderFilterTags, changeCheckboxTagState, changeRadioTagState, selectOneTag, deselectOneTag
} from '../../utils/filter-tags';
import {
  BasePage,
  TitleH1,
  CardPlace,
  WhereToGoRecommend
} from './index';
import Api from '../../utils/api';

const ageFilters = [
  { filter: '8-10 лет', name: '8-10 лет', isActive: false },
  { filter: '11-13 лет', name: '11-13 лет', isActive: false },
  { filter: '14-18 лет', name: '14-18 лет', isActive: false },
  { filter: '18+ лет', name: '18+ лет', isActive: false }
];

function WhereToGo({ openPopupCities }) {
  useSmoothScrollOnWindow({ top: 0 });

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
  const [activeCategories, setActiveCategories] = useState(new Set());

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    changeCheckboxTagState(setCategories, { inputValue, isChecked });

    if (inputValue === ALL_CATEGORIES) {
      setActiveCategories(new Set());
      setIsFiltersUsed(true);
      return;
    }

    // если такой фильтр уже есть
    if (activeCategories.has(inputValue)) {
      setActiveCategories((set) => {
        set.delete(inputValue);
        return set;
      });
      setIsFiltersUsed(true);
      return;
    }

    // новый фильтр
    setIsFiltersUsed(true);
    setActiveCategories((set) => {
      set.add(inputValue);
      return set;
    });
  };

  // хэндлер клика по фильтру ВОЗРАСТ
  const changeAge = (inputValue, isChecked) => {
    changeRadioTagState(setAges, { inputValue, isChecked });
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

    // ВСЕ
    if (activeCategories.size === 0) {
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
    if (activeCategories.size > 0) {
      if (!activeAgeFilter) {
        // + БЕЗ ВОЗРАСТА
        const filterByCategory = places.filter((place) => activeCategories.has(place.category));
        setFilteredPlaces(filterByCategory);
      } else {
        // + ВОЗРАСТ
        const filterByAge = places.filter((place) => filterAgeRanges(place.age, activeAgeFilter));
        const filterByCategory = filterByAge
          .filter((place) => activeCategories.has(place.category));

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
      .catch((error) => console.log(error));
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
            {renderFilterTags(categories, 'checkbox', changeCategory)}
          </ul>
          <ul className="tags__list">
            {renderFilterTags(ages, 'checkbox', changeAge)}
          </ul>
        </div>
      </section>

      {currentUser && (<WhereToGoRecommend />)}

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

WhereToGo.propTypes = {
  openPopupCities: PropTypes.func
};

WhereToGo.defaultProps = {
  openPopupCities: () => {}
};

export default WhereToGo;
