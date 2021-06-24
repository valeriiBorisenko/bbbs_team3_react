import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './Rights.scss';

import { ALL_CATEGORIES, FIGURES, COLORS } from '../../config/constants';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { useScrollToTop } from '../../hooks/index';

// json data
import rightsData from '../../utils/server-responses/rights.json';
import rightsTags from '../../utils/server-responses/rights-tags.json';

import { BasePage, Loader, TitleH1, Paginate, CardRights } from './index';

const Rights = () => {
  useScrollToTop();

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // Стейты с данными Статьи, Теги, Отфильтрованные Статьи
  const [pageData, setPageData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Загрузка данных
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
        article.tags.some((tag) => activeCategories.includes(tag.category))
      );

      setFilteredArticles(filterByCategory);

      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  // запуск фильтрации
  useEffect(() => {
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // Временно адаптирован под хардкод компонента и отсутствие АПИ
  useEffect(() => {
    setIsLoading(true);
    // const offset = pageSize * pageNumber;
    // Здесь будет АПИ запросы тегов и карточек
    setPageData(rightsData.results);
    setFilteredArticles(rightsData.results);
    setPageCount(Math.ceil(rightsData.count / pageSize));

    const categoriesArr = rightsTags.map((tag) => tag.category);
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

    setIsLoading(false);
  }, [pageSize, pageNumber]);

  // Юз эффект для пагинации
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1439px)');
    const largeQuery = window.matchMedia('(max-width: 1919px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(4);
      } else if (largeQuery.matches) {
        setPageSize(9);
      } else {
        setPageSize(16);
      }
    };
    listener();

    smallQuery.addEventListener('change', listener);
    largeQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
      largeQuery.removeEventListener('change', listener);
    };
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
        {!isLoading && (
          <div className="tags">
            <ul className="tags__list">
              {renderFilterTags(categories, 'checkbox', changeCategory)}
            </ul>
          </div>
        )}
      </section>
      {isLoading ? (
        <Loader isNested />
      ) : (
        <>
          <section className="rights page__section">
            {/* !!Нужно решить проблему с полосками они жестко захаркожены!! */}
            <div className="rights__line" />
            <div className="rights__line" />
            <div className="rights__line" />
            {filteredArticles.map((item, i) => (
              <CardRights
                key={item.id}
                title={item.title}
                tags={item.tags}
                // временные значение shape, color поскольку данные будут прихдить от БЭКА?
                shape={FIGURES[i % FIGURES.length]}
                color={COLORS[i % COLORS.length]}
              />
            ))}
          </section>

          <section className="rights-pagination page__section">
            <Paginate
              sectionClass="cards-section__pagination"
              pageCount={pageCount}
              value={pageNumber}
              onChange={setPageNumber}
            />
          </section>
        </>
      )}
    </BasePage>
  );
};

export default Rights;
