import './WhereToGo.scss';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import TitleH1 from '../ui/TitleH1/TitleH1';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';
import CardPlace from '../ui/CardPlace/CardPlace';
// import CardPl from '../ui/CardPl/CardPl';
// import Loader from '../ui/Loader/Loader';
// import CurrentUserContext from '../../contexts/CurrentUserContext';
import Api from '../../utils/api';

// какие пропсы нужны
// открытие попапа города ??
// выбранный город ??
function WhereToGo() {
  const ageRange = ['8-10 лет', '11-13 лет', '14-18 лет', '18+ лет'];

  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  // понадобится для фильтрации - запоминать название кликнутой кнопки
  // из компонента попадаешь в колбэк, там устанавливаешь значение в стейт
  // const [activeCategory, setActiveCategory] = useState(['Все']);
  // const [activeAgeRange, setActiveAgeRange] = useState('');

  // const currentUser = useContext(CurrentUserContext);
  console.log(useContext);

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

  function renderSomeFilters(array, typeOfFilter) {
    return array.map((filterName) => (
      <li className="tags__list-item" key={filterName}>
        <PseudoButtonCheckbox
          type={typeOfFilter}
          name="categories"
          value={filterName}
          title={filterName}
          filters={filterName}
          // onChange={handleCheckboxChange}
          // onClick={handleCheckboxClick}
          //! надо передавать колбэки т.к ты 2 списка делаешь в 1 функции
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
      {/* тайтл + фильтры */}
      <section className="lead main-section page__section fade-in">
        <TitleH1 title="Куда пойти" />
        <div className="tags">
          <ul className="tags__list">
            {renderSomeFilters(categories, 'checkbox')}
          </ul>
          <ul className="tags__list">
            {renderSomeFilters(ageRange, 'radio')}
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
        {/* проблема с цветами карточек */}
        {/* с цветами можно разобраться так
          colors[Math.floor(Math.random() * i)] + массив цветов нужен */}
        {/* CardPl -> из-за маргин 0-авто в классе card-container все ломается */}
        {places.map((place) => (
          <CardPlace data={place} key={place.id} sectionClass="card-container_type_article" />
          // <CardPl data={place} key={place.id} />
          // может приспособить CardPlace компонент, просто с классами поиграть
          // (с главной один, отсюда другой)
        ))}
      </section>
    </>
    //! нужен лоадер ко всему этому пока данные грузятся, а то страница мигает
  );
}

export default WhereToGo;
