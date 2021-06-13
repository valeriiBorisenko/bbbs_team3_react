/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
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

  const [filters, setFilters] = useState(ageFilters);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  const [activeCategories, setActiveCategories] = useState(new Set()); //! категории

  console.log({ ageFilters: filters });
  console.log({ categories });
  console.log({ activeCategories });
  console.log({ placeFilters: filteredPlaces });

  function handleCheckboxCategoryChange(inputName, isChecked) {
    setCategories((stateFilters) => stateFilters.map((filter) => {
      if (filter.filter === inputName) {
        // eslint-disable-next-line no-param-reassign
        filter.isActive = isChecked;
      }
      return filter;
    }));

    if (inputName === 'Все') {
      // console.log('ВСЕ');
      setActiveCategories(new Set());
      setIsFiltersUsed(true);
      return;
    }
    // если такой фильтр уже есть
    if (activeCategories.has(inputName)) {
      // console.log('уже есть такой фильтр');
      setActiveCategories((set) => {
        set.delete(inputName);
        return set;
      });
      setIsFiltersUsed(true);
      return;
    }

    // новый фильтр
    // console.log('это новый фильтр');
    setIsFiltersUsed(true);
    setActiveCategories((set) => {
      set.add(inputName);
      return set;
    });
  }

  // function handleCheckboxCategoryChange() {
  // }

  //! фильтры ВОЗРАСТ
  // function handleCheckboxAgeClick(evt, value) {
  //   const { target } = evt;
  //   console.log('target', target);
  //   if (value === activeAgeRange) {
  //     setActiveAgeRange(false);
  //   } else {
  //     setActiveAgeRange(value);
  //   }
  // }

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
  function filterMePlacesFINAL() {
    if (isFiltersUsed) {
      // console.log('filterMePlacesFINAL isFiltersUsed мы тут');
      setFilteredPlaces(places);
      return;
    }

    // console.log('ВОШЛИ В ФУНКЦИЮ filterMePlacesFINAL');
    // ВСЕ + БЕЗ ВОЗРАСТА (по умолчанию)
    const activeAgeFilter = filters.find((filter) => filter.isActive);
    console.log({ activeAgeFilter });

    if (activeCategories.size === 0 && !activeAgeFilter) {
      // console.log('1. ВСЕ + БЕЗ ВОЗРАСТА');
      // setIsFiltersUsed(false);
      setFilteredPlaces(places);
      // console.log('1. places', places);
      // return places;
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          // eslint-disable-next-line no-param-reassign
          filter.isActive = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          filter.isActive = false;
        }
        return filter;
      }));
      return;
    }

    // ВСЕ + ВОЗРАСТ
    if (activeCategories.size === 0 && activeAgeFilter) {
      // console.log('2. ВСЕ + ВОЗРАСТ');
      // отфильтровали по возрасту
      const a = places.filter((place) => filterAgeRanges(place.age, activeAgeFilter));
      // console.log('2. a', a);
      setFilteredPlaces(a);
      // setIsFiltersUsed(false);
      // return a;
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          // eslint-disable-next-line no-param-reassign
          filter.isActive = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          filter.isActive = false;
        }
        return filter;
      }));
      return;
    }

    // КАТЕГОРИИ + БЕЗ ВОЗРАСТА
    if (activeCategories.size > 0 && !activeAgeFilter) {
      // console.log('3. КАТЕГОРИИ + БЕЗ ВОЗРАСТА');
      // отфильтровали по категории
      const a = places.filter((place) => activeCategories.has(place.category));
      // console.log('3. a', a);
      setFilteredPlaces(a);
      // setIsFiltersUsed(false);
      // return a;
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          // eslint-disable-next-line no-param-reassign
          filter.isActive = false;
        }
        return filter;
      }));
      return;
    }

    // КАТЕГОРИЯ + ВОЗРАСТ
    if (activeCategories.size > 0 && activeAgeFilter) {
      // console.log('4. КАТЕГОРИИ + ВОЗРАСТ');
      const a = places.filter((place) => filterAgeRanges(place.age, activeAgeFilter));
      const b = a.filter((place) => activeCategories.has(place.category));
      // console.log('4. b', b);
      setFilteredPlaces(b);
      // setIsFiltersUsed(false);
      // return b;
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          // eslint-disable-next-line no-param-reassign
          filter.isActive = false;
        }
        return filter;
      }));
      return;
    }

    if (activeCategories.size === 0) {
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          // eslint-disable-next-line no-param-reassign
          filter.isActive = true;
        }
        return filter;
      }));
    }

    // console.log('ДТП');
    // return [];
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
        // setCategories(['Все', ...uniqueCategories]);
        setCategories([
          { filter: 'Все', isActive: true },
          ...uniqueCategories
        ]);
      })
      .catch((error) => console.log(error));

    // if (!currentUser && !unauthСity) {
    //   openPopupCities();
    // }
  }, []);

  useEffect(() => {
    console.log('apply EFFECT');
    filterMePlacesFINAL();
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
            {renderSomeFilters(categories, 'checkbox', handleCheckboxCategoryChange)}
          </ul>
          <ul className="tags__list">
            {renderSomeFilters(filters, 'checkbox', handleCheckboxAgeChange)}
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
