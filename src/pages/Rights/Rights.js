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

  // Стейты с данными Статьи, Теги
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  // Загрузка данных
  const [isLoading, setIsLoading] = useState(false);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  // функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    setIsLoading(true);
    const offset = pageSize * pageNumber;
    const activeCategories = categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.slug);
    // ВСЕ
    if (activeCategories.length === 0) {
      Api.getRightsData({ limit: pageSize, offset, tags: '' })
        .then(({ results, count }) => {
          setArticles(results);
          setPageCount(Math.ceil(count / pageSize));
          setIsLoading(false);
        })
        .catch((err) => console.log(err));

      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ
    if (activeCategories.length > 0) {
      const tagsStr = activeCategories.join(',');
      deselectOneTag(setCategories, ALL_CATEGORIES);
      Api.getRightsData({
        limit: pageSize,
        offset,
        tags: tagsStr,
      })
        .then(({ results, count }) => {
          setArticles(results);
          setPageCount(Math.ceil(count / pageSize));
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };

  // Отрисовка тэгов при загрузке страницы
  useEffect(() => {
    Api.getRightsTags().then((tags) => {
      const categoriesArr = Array.from(tags).map((tag) => ({
        filter: tag.name.toLowerCase(),
        name: tag.name[0].toUpperCase() + tag.name.slice(1),
        isActive: false,
        slug: tag.slug,
      }));

      setCategories([
        {
          filter: ALL_CATEGORIES,
          name: ALL_CATEGORIES,
          isActive: true,
          slug: '',
        },
        ...categoriesArr,
      ]);
    });
  }, []);

  // запуск фильтрации
  useEffect(() => {
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  //  АПИ статей + пагинация
  useEffect(() => {
    setIsLoading(true);
    const offset = pageSize * pageNumber;

    Api.getRightsData({ limit: pageSize, offset })
      .then(({ results, count }) => {
        setArticles(results);
        setPageCount(Math.ceil(count / pageSize));
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
        <div className="tags">
          <ul className="tags__list">
            {renderFilterTags(categories, 'checkbox', changeCategory)}
          </ul>
        </div>
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
            sectionClass="rights page__section"
          >
            {articles.map((item, i) => (
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
