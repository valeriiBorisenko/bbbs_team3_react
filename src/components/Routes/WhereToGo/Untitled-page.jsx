/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import './WhereToGo.scss';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { repeatSchema } from '../../utils/utils';
import { COLORS } from '../../utils/constants';
import TitleH1 from '../ui/TitleH1/TitleH1';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';
import CardPlace from '../ui/CardPlace/CardPlace';
// import Loader from '../ui/Loader/Loader';
// import CurrentUserContext from '../../contexts/CurrentUserContext';
import Api from '../../utils/api';

const ageFilters = [
  { filter: '8-10 лет', isActive: false },
  { filter: '11-13 лет', isActive: false },
  { filter: '14-18 лет', isActive: false },
  { filter: '18+ лет', isActive: false }
];

function WhereToGo() {
  const [filters, setFilters] = useState(ageFilters);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  const [isAll, setIsAll] = useState(true); //! ВСЕ
  const [activeCategories, setActiveCategories] = useState(new Set()); //! категории
  const [activeAgeRange, setActiveAgeRange] = useState(''); //! возраст-фильтр

  //! фильтры КАТЕГОРИЯ
  function handleCheckboxCategoryClick(event, filter) {
    const { target } = event;
    console.dir('target', target);

    // если мы нажали на ВСЕ
    if (filter === 'Все') {
      console.log('ВСЕ');
      setIsAll(true);
      setActiveCategories(new Set());
      setIsFiltersUsed(true);
      return;
    }

    // если такой фильтр уже есть
    if (activeCategories.has(filter)) {
      console.log('уже есть такой фильтр');
      setActiveCategories((set) => {
        set.delete(filter);
        return set;
      });
      setIsFiltersUsed(true);
      return;
    }

    // новый фильтр
    console.log('это новый фильтр');
    setIsFiltersUsed(true);
    if (isAll) {
      setIsAll(false);
    }
    setActiveCategories((set) => {
      set.add(filter);
      return set;
    });
  }

  //! фильтры ВОЗРАСТ
  function handleCheckboxAgeClick(evt, value) {
    const { target } = evt;
    console.dir('target', target);

    if (value === activeAgeRange) {
      setActiveAgeRange(null);
      setIsFiltersUsed(false);
    } else {
      setActiveAgeRange(value);
      setIsFiltersUsed(true);
    }
  }
  console.log(handleCheckboxAgeClick);

  function handleCheckboxAgeChange(inputName, isChecked) {
    setFilters((stateFilters) => stateFilters.map((filter) => {
      if (filter.filter === inputName) {
        // eslint-disable-next-line no-param-reassign
        filter.isActive = isChecked;
      } else {
        // eslint-disable-next-line no-param-reassign
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
  //! может возвращать ТРУ/ФАЛС отсюда и запихнуть в places.filter() эту функц
  function filterMePlacesFINAL() {
    if (isFiltersUsed) {
      console.log('filterMePlacesFINAL isFiltersUsed мы тут');
      setFilteredPlaces(places);
      return;
    }

    console.log('ВОШЛИ В ФУНКЦИЮ filterMePlacesFINAL');
    // ВСЕ + БЕЗ ВОЗРАСТА (по умолчанию)
    const activeAgeFilter = filters.find((filter) => filter.isActive);

    if (isAll && !activeAgeFilter) {
      console.log('1. ВСЕ + БЕЗ ВОЗРАСТА');
      // setIsFiltersUsed(false);
      setFilteredPlaces(places);
      console.log('1. places', places);
      // return places;
      return;
    }

    // ВСЕ + ВОЗРАСТ
    if (isAll && activeAgeFilter) {
      console.log('2. ВСЕ + ВОЗРАСТ');
      // отфильтровали по возрасту
      const a = places.filter((place) => filterAgeRanges(place.age, activeAgeFilter));
      console.log('2. a', a);
      setFilteredPlaces(a);
      // setIsFiltersUsed(false);
      // return a;
      return;
    }

    // КАТЕГОРИИ + БЕЗ ВОЗРАСТА
    if (activeCategories.size > 0 && !activeAgeFilter) {
      console.log('3. КАТЕГОРИИ + БЕЗ ВОЗРАСТА');
      // отфильтровали по категории
      const a = places.filter((place) => activeCategories.has(place.category));
      console.log('3. a', a);
      setFilteredPlaces(a);
      // setIsFiltersUsed(false);
      // return a;
      return;
    }

    // КАТЕГОРИЯ + ВОЗРАСТ
    if (activeCategories.size > 0 && activeAgeFilter) {
      console.log('4. КАТЕГОРИИ + ВОЗРАСТ');
      const a = places.filter((place) => filterAgeRanges(place.age, activeAgeFilter));
      const b = a.filter((place) => activeCategories.has(place.category));
      console.log('4. b', b);
      setFilteredPlaces(b);
      // setIsFiltersUsed(false);
      // return b;
      return;
    }

    console.log('ДТП');
    // return [];
  }

  // АПИ
  useEffect(() => {
    Api.getPlaces()
      .then((result) => {
        setPlaces(result);

        const categoriesArr = result.map((place) => place.category);
        const set = new Set(categoriesArr);
        const uniqueCategories = Array.from(set);
        setCategories(['Все', ...uniqueCategories]);
      })
      .catch((error) => console.log(error));

    // if (!currentUser && !unauthСity) {
    //   openPopupCities();
    // }
  }, []);

  useEffect(() => {
    console.log('EFFECT');
    filterMePlacesFINAL();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  function renderFilters(filterList, type, handleCheckboxClick) {
    return filterList.map((item) => (
      <li className="tags__list-item" key={item.filter}>
        <PseudoButtonCheckbox
          type={type}
          name="categories"
          value={item.filter}
          title={item.filter}
          isActive={item.isActive}
          onClick={handleCheckboxClick}
          //! надо передавать колбэки т.к ты 2 списка делаешь в 1 функции
        />
      </li>
    ));
  }

  // console.log(isFiltersUsed);
  // const whatDataToRender = isFiltersUsed ? filteredPlaces : places;
  // console.log('whatDataToRender', whatDataToRender);

  // console.log('activeCategories', activeCategories);

  return (
    <>
      <Helmet>
        <title>Куда пойти</title>
        <meta
          name="description"
          content="Куда вы можете пойти, что рекомендуют наши наставники"
        />
      </Helmet>
      {/* тайтл + фильтры */}
      <section className="lead main-section page__section fade-in">
        <TitleH1 title="Куда пойти" />
        <div className="tags">
          <ul className="tags__list">
            {renderFilters(categories, 'checkbox', handleCheckboxCategoryClick)}
          </ul>
          <ul className="tags__list">
            {renderFilters(filters, 'checkbox', handleCheckboxAgeChange)}
          </ul>
        </div>
      </section>

      {/* форма, показывать, только если юзер авторизован, надо сделать */}

      {/* большая карточка */}
      <section className="place main-section page__section fade-in">
        <CardPlace
          key={places.find((place) => place.chosen)?.id}
          data={places.find((place) => place.chosen)}
          sectionClass="card-container_type_main-article"
          isMain
        />
      </section>

      {/* секция карточек */}
      <section className="cards-grid main-section page__section">
        {/* {places.map((place, idx) => (
          <CardPlace
            data={place}
            key={place.id}
            color={repeatSchema(idx, places.length, COLORS)}
            sectionClass="card-container_type_article"
          />
        ))} */}
        {/* {filterMePlacesFINAL().map((place, idx) => (
          <CardPlace
            data={place}
            key={place.id}
            color={repeatSchema(idx, places.length, COLORS)}
            sectionClass="card-container_type_article"
          />
        ))} */}
        {filteredPlaces.map((place, idx) => (
          <CardPlace
            data={place}
            key={place.id}
            color={repeatSchema(idx, places.length, COLORS)}
            sectionClass="card-container_type_article"
          />
        ))}
        {console.log(1)}
      </section>
    </>
    //! нужен лоадер ко всему этому пока данные грузятся, а то страница мигает
  );
}

export default WhereToGo;
