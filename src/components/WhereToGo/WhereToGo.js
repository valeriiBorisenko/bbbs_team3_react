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

function WhereToGo() {
  const ageRange = ['8-10 лет', '11-13 лет', '14-18 лет', '18+ лет'];

  const [places, setPlaces] = useState([]);
  // const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  const [isAll, setIsAll] = useState(true); //! ВСЕ
  const [activeCategories, setActiveCategories] = useState(new Set()); //! категории
  const [activeAgeRange, setActiveAgeRange] = useState(''); //! возраст-фильтр

  // const currentUser = useContext(CurrentUserContext);
  // console.log(useContext);

  //! фильтры КАТЕГОРИЯ
  function handleCheckboxCategoryClick(evt, filter) {
    const { target } = evt;
    console.log('target', target);

    // если мы нажали на ВСЕ
    if (filter === 'Все') {
      console.log('ВСЕ');
      setIsAll(true);
      setActiveCategories(new Set());
      // setIsFiltersUsed(true);
      return;
    }

    // если такой фильтр уже есть
    if (activeCategories.has(filter)) {
      console.log('уже есть такой фильтр');
      setActiveCategories((set) => {
        set.delete(filter);
        return set;
      });
      // setIsFiltersUsed(true);
      return;
    }

    // новый фильтр
    console.log('это новый фильтр');
    // setIsFiltersUsed(true);
    setIsAll(false);
    setActiveCategories((set) => {
      set.add(filter);
      return set;
    });
  }

  function handleCheckboxCategoryChange() {
  }

  //! фильтры ВОЗРАСТ
  function handleCheckboxAgeClick(evt, value) {
    const { target } = evt;
    console.log('target', target);
    setActiveAgeRange(value);
    if (value === activeAgeRange) {
      setActiveAgeRange(false);
    }
    // setIsFiltersUsed(true);
  }

  function handleCheckboxAgeChange() {
  }

  // вспомогательная функция-фильтровщик возраста
  function filterAgeRanges(age) {
    switch (activeAgeRange) {
      case '8-10 лет':
        return age >= 8 && age <= 10;
      case '11-13 лет':
        return age >= 11 && age <= 13;
      case '14-18 лет':
        return age >= 14 && age < 18;
      case '18+ лет':
        return age >= 18;
      default:
        return age;
    }
  }

  //! Финальный массив ивентов
  function filterMePlacesFINAL() {
    //! isAll = true/false
    //! activeAgeRange = ''/'10-14'
    //! activeCategories = [] / [юююю]

    // ВСЕ + БЕЗ ВОЗРАСТА (по умолчанию)
    if (isAll && activeAgeRange === '') {
      console.log('ВСЕ + БЕЗ ВОЗРАСТА');
      // setFilteredPlaces(places);
      return places;
      // return;
    }

    // ВСЕ + ВОЗРАСТ
    if (isAll && activeCategories) {
      console.log('ВСЕ + ВОЗРАСТ');
      // отфильтровали по возрасту
      const a = places.filter((place) => filterAgeRanges(place.age));
      console.log('a', a);
      // setFilteredPlaces(a);
      return a;
      // return;
    }

    // КАТЕГОРИИ + БЕЗ ВОЗРАСТА
    if (activeCategories.size > 0 && activeAgeRange === '') {
      console.log('КАТЕГОРИИ + БЕЗ ВОЗРАСТА');
      // отфильтровали по категории
      const a = places.filter((place) => activeCategories.has(place.category));
      console.log('a', a);
      // setFilteredPlaces(a);
      return a;
      // return;
    }

    // КАТЕГОРИЯ + ВОЗРАСТ
    if (activeCategories.size > 0 && activeAgeRange) {
      console.log('КАТЕГОРИИ + ВОЗРАСТ');
      const a = places.filter((place) => filterAgeRanges(place.age));
      const b = a.filter((place) => activeCategories.has(place.category));
      console.log('b', b);
      // setFilteredPlaces(b);
      return b;
      // return;
    }

    // !авария
    console.log('AVARIA');
    return [];
  }

  // АПИ
  useEffect(() => {
    Api.getPlaces()
      .then((result) => {
        setPlaces(result);
        // setFinalData(result);

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

  // useEffect(() => {
  //   console.log('effect');
  //   filterMePlacesFINAL();
  //   setIsFiltersUsed(false);
  // }, [isFiltersUsed]);

  function renderSomeFilters(array, typeOfFilter, handleCheckboxClick, handleCheckboxChange) {
    return array.map((filterName) => (
      <li className="tags__list-item" key={filterName}>
        <PseudoButtonCheckbox
          type={typeOfFilter}
          name="categories"
          value={filterName}
          title={filterName}
          filters={filterName}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
          //! надо передавать колбэки т.к ты 2 списка делаешь в 1 функции
        />
      </li>
    ));
  }

  // console.log(isFiltersUsed);
  // const whatDataToRender = isFiltersUsed ? filterMePlacesFINAL() : places;
  // console.log('whatDataToRender', whatDataToRender);

  console.log('activeCategories', activeCategories);

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
            {renderSomeFilters(categories, 'checkbox', handleCheckboxCategoryClick, handleCheckboxCategoryChange)}
          </ul>
          <ul className="tags__list">
            {renderSomeFilters(ageRange, 'radio', handleCheckboxAgeClick, handleCheckboxAgeChange)}
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
        {filterMePlacesFINAL().map((place, idx) => (
          <CardPlace
            data={place}
            key={place.id}
            color={repeatSchema(idx, places.length, COLORS)}
            sectionClass="card-container_type_article"
          />
        ))}
      </section>
    </>
    //! нужен лоадер ко всему этому пока данные грузятся, а то страница мигает
  );
}

export default WhereToGo;
