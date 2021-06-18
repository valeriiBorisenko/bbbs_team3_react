/* eslint-disable no-unused-vars */
import './Rights.scss';

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import CurrentUserContext from '../../contexts/CurrentUserContext';
import { BasePage, TitleH1 } from './index';
import { useScrollToTop } from '../../hooks/index';
import { ALL_CATEGORIES } from '../../config/constants';
import {
  renderFilterTags,
  changeCheckboxTagState,
  selectOneTag,
  deselectOneTag
} from '../../utils/filter-tags';

// Временный хардкод данных рубрик без информации при клике
const articlesData = [
  {
    category: 'Пенсии',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 1
  },
  {
    category: 'Образование',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 2
  },
  {
    category: 'Транспорт',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 3
  },
  {
    category: 'Трудоустройство',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 4
  },
  {
    category: 'Пенсии',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 5
  },
  {
    category: 'Транспорт',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 6
  },
  {
    category: 'Транспорт',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 7
  }
];

const Rights = ({ openPopupCities }) => {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    changeCheckboxTagState(setCategories, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  // функция-фильтратор
  const handleFiltration = () => {
    const activeCategories = categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.filter);

    // ВСЕ
    if (activeCategories.length === 0) {
      setFilteredArticles(articles);

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ
    if (activeCategories.length > 0) {
      const filterByCategory = articles.filter((article) =>
        activeCategories.includes(article.category)
      );

      setFilteredArticles(filterByCategory);

      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  // Хук для АПИ
  // Временно адаптирован под хардкод компонента и отсутствие АПИ
  useEffect(() => {
    setArticles(articlesData);
    setFilteredArticles(articlesData);

    const categoriesArr = articlesData.map((article) => article.category);
    const set = new Set(categoriesArr);
    const uniqueCategories = Array.from(set).map((item) => ({
      filter: item,
      name: item,
      isActive: false
    }));

    setCategories([
      { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
      ...uniqueCategories
    ]);
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
        <title>Права детей</title>
        <meta
          name="description"
          content="Информационные рубрики о правах детей"
        />
      </Helmet>
      <section className="lead page__section fade-in">
        <TitleH1 title="Права детей" />
        <div className="tags">
          <ul className="tags__list">
            {renderFilterTags(categories, 'checkbox', changeCategory)}
          </ul>
        </div>
        <div />
      </section>
    </BasePage>
  );
};

Rights.propTypes = {
  openPopupCities: PropTypes.func
};

Rights.defaultProps = {
  openPopupCities: () => {}
};

export default Rights;
