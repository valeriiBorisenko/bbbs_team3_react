/* eslint-disable no-param-reassign */
import './WhereToGo.scss';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import { repeatSchema } from '../../../utils/utils';
import { COLORS } from '../../../utils/constants';
import CurrentUserContext from '../../../contexts/CurrentUserContext';
import TitleH1 from '../../ui/TitleH1/TitleH1';
import PseudoButtonTag from '../../ui/PseudoButtonTag/PseudoButtonTag';
import CardPlace from '../../ui/CardPlace/CardPlace';
import WhereToGoPreview from '../../ui/WhereToGoPreview/WhereToGoPreview';
import Loader from '../../ui/Loader/Loader';
import Api from '../../../utils/api';

const ageFilters = [
  { filter: '8-10 лет', isActive: false },
  { filter: '11-13 лет', isActive: false },
  { filter: '14-18 лет', isActive: false },
  { filter: '18+ лет', isActive: false }
];

function WhereToGo({ openPopupCities }) {
  const currentUser = useContext(CurrentUserContext);

  // начальные места из API
  const [places, setPlaces] = useState([]);

  // мутабельный массив для применения фильтров
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  const [ages, setAges] = useState(ageFilters); // фильтры возраста
  const [categories, setCategories] = useState([]); // фильтры категорий
  const [activeCategories, setActiveCategories] = useState(new Set());

  function changeCategory(inputName, isChecked) {
    // смена цвета и состояния чекбокса
    setCategories((stateFilters) => stateFilters.map((filter) => {
      if (filter.filter === inputName) {
        filter.isActive = isChecked;
      }
      return filter;
    }));

    if (inputName === 'Все') {
      setActiveCategories(new Set());
      setIsFiltersUsed(true);
      return;
    }

    // если такой фильтр уже есть
    if (activeCategories.has(inputName)) {
      setActiveCategories((set) => {
        set.delete(inputName);
        return set;
      });
      setIsFiltersUsed(true);
      return;
    }

    // новый фильтр
    setIsFiltersUsed(true);
    setActiveCategories((set) => {
      set.add(inputName);
      return set;
    });
  }

  //! фильтры ВОЗРАСТ
  function changeAge(inputName, isChecked) {
    setAges((stateFilters) => stateFilters.map((filter) => {
      if (filter.filter === inputName) {
        filter.isActive = isChecked;
      } else {
        filter.isActive = false;
      }
      return filter;
    }));
    setIsFiltersUsed(true);
  }

  // вспомогательная функция-фильтровщик возраста
  function filterAgeRanges(age, activeAge) {
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
  }

  //! Финальный массив ивентов
  function handleFiltration() {
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

      // смена цвета и состояния чекбокса 'Все'
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          filter.isActive = true;
        } else {
          filter.isActive = false;
        }
        return filter;
      }));
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
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          filter.isActive = false;
        }
        return filter;
      }));
    }
  }

  // АПИ
  useEffect(() => {
    Api.getPlaces()
      .then((result) => {
        setPlaces(result);
        setFilteredPlaces(result);

        const categoriesArr = result.map((place) => place.category);
        const set = new Set(categoriesArr);
        const uniqueCategories = Array.from(set).map((item) => ({ filter: item, isActive: false }));
        setCategories([
          { filter: 'Все', isActive: true },
          ...uniqueCategories
        ]);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  function renderSomeFilters(filterList, type, handleCheckboxClick) {
    return filterList.map((item) => (
      <li className="tags__list-item" key={item.filter}>
        <PseudoButtonTag
          type={type}
          name="categories"
          value={item.filter}
          title={item.filter}
          isActive={item.isActive}
          onClick={handleCheckboxClick}
        />
      </li>
    ));
  }

  useEffect(() => {
    if (!currentUser) {
      openPopupCities();
    }
  }, []);

  if (places.length === 0) {
    return <Loader />;
  }

  return (
    <>
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
            {renderSomeFilters(categories, 'checkbox', changeCategory)}
          </ul>
          <ul className="tags__list">
            {renderSomeFilters(ages, 'checkbox', changeAge)}
          </ul>
        </div>
      </section>

      {currentUser && (<WhereToGoPreview />)}

      <section className="place__main page__section fade-in">
        <CardPlace
          key={places.find((place) => place.chosen)?.id}
          data={places.find((place) => place.chosen)}
          sectionClass="card-container_type_main-article"
          isMain
        />
      </section>

      <section className="cards-grid page__section">
        {filteredPlaces.map((place, idx) => (
          <CardPlace
            data={place}
            key={place.id}
            color={repeatSchema(idx, places.length, COLORS)}
            sectionClass="card-container_type_article fade-in"
          />
        ))}
      </section>
    </>
  );
}

WhereToGo.propTypes = {
  openPopupCities: PropTypes.func
};

WhereToGo.defaultProps = {
  openPopupCities: () => {}
};

export default WhereToGo;
