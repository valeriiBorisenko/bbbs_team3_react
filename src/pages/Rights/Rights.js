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
import Api from '../../utils/api';

import {
  BasePage,
  Loader,
  TitleH1,
  CardRights,
  CardsSectionWithLines,
} from './index';

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

  // функция-фильтратор пока реализация на фронте без использованя АПИ
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
        article.tags.some((tag) => activeCategories.includes(tag.name))
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

  //  АПИ теги и статьи
  useEffect(() => {
    setIsLoading(true);
    const offset = pageSize * pageNumber;

    Promise.all([
      Api.getRightsData({ limit: pageSize, offset }),
      Api.getRightsTags(),
    ])
      .then(([{ results, count }, tags]) => {
        setPageData(results);
        setFilteredArticles(results);
        setPageCount(Math.ceil(count / pageSize));

        const categoriesArr = Array.from(tags).map((tag) => ({
          filter: tag.name.toLowerCase(),
          name: tag.name[0].toUpperCase() + tag.name.slice(1),
          isActive: false,
        }));

        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...categoriesArr,
        ]);

        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [pageSize, pageNumber]);

  // Юз эффект для пагинации
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

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
          {/* !!Нужно решить проблему с полосками они жестко захаркожены!! */}
          <CardsSectionWithLines
            pageCount={pageCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            sectionClassCards="rights page__section"
          >
            {filteredArticles.map((item, i) => (
              <CardRights
                key={item.id}
                title={item.title}
                tags={item.tags}
                shape={FIGURES[i % FIGURES.length]}
                color={COLORS[i % COLORS.length]}
              />
            ))}
          </CardsSectionWithLines>
        </>
      )}
    </BasePage>
  );
};

export default Rights;
