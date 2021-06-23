/* eslint-disable no-unused-vars */
import './Rights.scss';

import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';

import CurrentUserContext from '../../contexts/CurrentUserContext';
import { BasePage, TitleH1 } from './index';
import { useScrollToTop } from '../../hooks/index';
import { ALL_CATEGORIES } from '../../config/constants';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import Loader from '../../components/utils/Loader/Loader';

// Временный хардкод данных рубрик без информации при клике
const articlesData = [
  {
    category: 'Пенсии',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 1,
  },
  {
    category: 'Образование',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 2,
  },
  {
    category: 'Транспорт',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 3,
  },
  {
    category: 'Трудоустройство',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 4,
  },
  {
    category: 'Пенсии',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 5,
  },
  {
    category: 'Транспорт',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 6,
  },
  {
    category: 'Транспорт',
    title: 'Пенсионное обеспечение для детей-сирот',
    type: 'Рубрика',
    id: 7,
  },
];

const Rights = () => {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [pageData, setPageData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  // функция-фильтратор
  const handleFiltration = () => {
    const activeCategories = categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.filter);

    // ВСЕ
    if (activeCategories.length === 0) {
      setFilteredArticles(pageData);

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ
    if (activeCategories.length > 0) {
      const filterByCategory = pageData.filter((article) =>
        activeCategories.includes(article.category),
      );

      setFilteredArticles(filterByCategory);

      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  // Временно адаптирован под хардкод компонента и отсутствие АПИ
  useEffect(() => {
    setIsLoading(false);
    setPageData(articlesData);
    setFilteredArticles(articlesData);

    const categoriesArr = articlesData.map((article) => article.category);
    const set = new Set(categoriesArr);
    const uniqueCategories = Array.from(set).map((item) => ({
      filter: item,
      name: item,
      isActive: false,
    }));

    setCategories([
      { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
      ...uniqueCategories,
    ]);
  }, []);

  // ---- Вероятно хуки для работы с отрисовкой страницы??
  // useEffect(() => {
  //   setIsLoading(true);
  //   const offset = pageSize * pageNumber;
  //   Api.ЗАРОС({ limit: pageSize, offset }).then(({ results, count }) => {
  //     setCatalogPageData(results);
  //     setPageCount(Math.ceil(count / pageSize));
  //     setIsLoading(false);
  //   });
  // }, [pageSize, pageNumber]);

  // useEffect(() => {
  //   const smallQuery = window.matchMedia('(max-width: 1439px)');
  //   const largeQuery = window.matchMedia('(max-width: 1919px)');

  //   const listener = () => {
  //     if (smallQuery.matches) {
  //       setPageSize(4);
  //     } else if (largeQuery.matches) {
  //       setPageSize(9);
  //     } else {
  //       setPageSize(16);
  //     }
  //   };
  //   listener();

  //   smallQuery.addEventListener('change', listener);
  //   largeQuery.addEventListener('change', listener);

  //   return () => {
  //     smallQuery.removeEventListener('change', listener);
  //     largeQuery.removeEventListener('change', listener);
  //   };
  // }, []);

  return (
    <BasePage>
      <Helmet>
        <title>Права детей</title>
        <meta name="description" content="Информационные рубрики о правах детей" />
      </Helmet>
      <section className="lead page__section fade-in">
        <TitleH1 title="Права детей" />
        {isLoading ? (
          <Loader isNested />
        ) : (
          <>
            <div className="tags">
              <ul className="tags__list">
                {renderFilterTags(categories, 'checkbox', changeCategory)}
              </ul>
            </div>
            <div />
          </>
        )}
      </section>
    </BasePage>
  );
};

export default Rights;
