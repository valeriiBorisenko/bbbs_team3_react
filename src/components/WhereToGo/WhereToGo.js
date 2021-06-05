import './WhereToGo.scss';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import TitleH1 from '../ui/TitleH1/TitleH1';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';
import CardPlace from '../ui/CardPlace/CardPlace';
// import Loader from '../ui/Loader/Loader';
// import CurrentUserContext from '../../contexts/CurrentUserContext';
import Api from '../../utils/api';

// какие пропсы нужны
// открытие попапа города ??
// выбранный город ??
function WhereToGo() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const ageRange = ['8-10 лет', '11-13 лет', '14-18 лет', '18+ лет'];
  // понадобится для фильтрации - запоминать название кликнутой кнопки
  // const [activeCategory, setActiveCategory] = useState(['Все']);
  // const [activeAgeRange, setActiveAgeRange] = useState('');

  // const currentUser = useContext(CurrentUserContext);
  console.log(useContext);
  // console.log(places, categoriesTags);

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

  function renderMeSomeFilters(array, typeOfFilter) {
    return array.map((filterName) => (
      <li className="tags__list-item" key={filterName}>
        <PseudoButtonCheckbox
          type={typeOfFilter}
          name="categories"
          // value={filterName}
          title={filterName}
          filters={filterName}
          // onChange={handleCheckboxChange}
          // onClick={handleCheckboxClick}
        />
      </li>
    ));
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
      <section className="lead page__section fade-in">
        <TitleH1 title="Куда пойти" />

        {/* фильтры */}
        <div className="tags">
          <ul className="tags__list">
            {renderMeSomeFilters(categories, 'checkbox')}
          </ul>
          <ul className="tags__list">
            {renderMeSomeFilters(ageRange, 'radio')}
          </ul>
        </div>

        {/* большая карточка */}
        <section className="place main-section page__section fade-in">
          <CardPlace
            key={places.find((place) => place.chosen)?.id}
            data={places.find((place) => place.chosen)}
          />
        </section>

        {/* секция карточек */}
        {/* //!нужно создать компонент карточки!!
         */}
      </section>
    </>
  );
}

export default WhereToGo;
