import './WhereToGo.scss';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import { repeatSchema } from '../../utils/utils';
import { COLORS } from '../../utils/constants';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import TitleH1 from '../ui/TitleH1/TitleH1';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';
import CardPlace from '../ui/CardPlace/CardPlace';
import WhereToGoPreview from '../ui/WhereToGoPreview/WhereToGoPreview';
import Loader from '../ui/Loader/Loader';
import Api from '../../utils/api';

function WhereToGo({ openPopupCities }) {
  const currentUser = useContext(CurrentUserContext);
  const ageRange = ['8-10 лет', '11-13 лет', '14-18 лет', '18+ лет'];
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAll, setIsAll] = useState(true); //! ВСЕ
  const [activeCategories, setActiveCategories] = useState(new Set()); //! категории
  const [activeAgeRange, setActiveAgeRange] = useState(''); //! возраст-фильтр

  function handleCheckboxCategoryClick(evt, filter) {
    const { target } = evt;
    console.log('target', target);

    if (filter === 'Все') {
      console.log('ВСЕ');
      setIsAll(true);
      setActiveCategories(new Set());
      return;
    }
    // если такой фильтр уже есть
    if (activeCategories.has(filter)) {
      console.log('уже есть такой фильтр');
      setActiveCategories((set) => {
        set.delete(filter);
        return set;
      });
      return;
    }

    // новый фильтр
    console.log('это новый фильтр');
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
    if (value === activeAgeRange) {
      setActiveAgeRange(false);
    } else {
      setActiveAgeRange(value);
    }
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
    // ВСЕ + БЕЗ ВОЗРАСТА (по умолчанию)
    if (isAll && activeAgeRange === '') {
      console.log('ВСЕ + БЕЗ ВОЗРАСТА');
      return places;
    }

    // ВСЕ + ВОЗРАСТ
    if (isAll && activeCategories) {
      console.log('ВСЕ + ВОЗРАСТ');
      // отфильтровали по возрасту
      const a = places.filter((place) => filterAgeRanges(place.age));
      console.log('a', a);
      return a;
    }

    // КАТЕГОРИИ + БЕЗ ВОЗРАСТА
    if (activeCategories.size > 0 && activeAgeRange === '') {
      console.log('КАТЕГОРИИ + БЕЗ ВОЗРАСТА');
      // отфильтровали по категории
      const a = places.filter((place) => activeCategories.has(place.category));
      console.log('a', a);
      return a;
    }

    // КАТЕГОРИЯ + ВОЗРАСТ
    if (activeCategories.size > 0 && activeAgeRange) {
      console.log('КАТЕГОРИИ + ВОЗРАСТ');
      const a = places.filter((place) => filterAgeRanges(place.age));
      const b = a.filter((place) => activeCategories.has(place.category));
      console.log('b', b);
      return b;
    }

    console.log('ДТП');
    return [];
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

    // показать попап ГОРОДА если незалогинен
  }, []);

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
            {renderSomeFilters(categories, 'checkbox', handleCheckboxCategoryClick, handleCheckboxCategoryChange)}
          </ul>
          <ul className="tags__list">
            {renderSomeFilters(ageRange, 'radio', handleCheckboxAgeClick, handleCheckboxAgeChange)}
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
        {filterMePlacesFINAL().map((place, idx) => (
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
