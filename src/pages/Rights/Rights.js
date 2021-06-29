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
import { changeCaseOfFirstLetter } from '../../utils/utils';
import { useScrollToTop, useDebounce } from '../../hooks/index';
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

  // Функция запроса ДАТЫ и её обработка
  const getRightsData = async (tagsStr = '') => {
    const offset = pageSize * pageNumber;
    const { results, count } = await Api.getRightsData({
      limit: pageSize,
      offset,
      tags: tagsStr,
    });
    setArticles(results);
    setPageCount(Math.ceil(count / pageSize));
    setIsLoading(false);
  };

  // Функция запроса тэгов и их обработка
  const getRingtsTags = async () => {
    const tags = await Api.getRightsTags();
    const categoriesArr = await tags.map((tag) => ({
      filter: tag.slug.toLowerCase(),
      name: changeCaseOfFirstLetter(tag.name),
      isActive: false,
    }));

    setCategories([
      {
        filter: ALL_CATEGORIES,
        name: ALL_CATEGORIES,
        isActive: true,
      },
      ...categoriesArr,
    ]);
  };

  // функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    const activeCategories = categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.filter);

    if (activeCategories.length === 0) {
      getRightsData();
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      const tagsStr = activeCategories.join(',');
      getRightsData(tagsStr);
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  const listener = (smallQuery, largeQuery) => {
    if (smallQuery.matches) {
      setPageSize(4);
    } else if (largeQuery.matches) {
      setPageSize(9);
    } else {
      setPageSize(16);
    }
  };

  // Отрисовка тэгов при загрузке страницы
  useEffect(() => {
    setIsLoading(true);
    getRingtsTags();
  }, []);

  // delay для фильтрации
  const debounceFiltration = useDebounce(handleFiltration, 1500);
  // запуск фильтрации
  useEffect(() => {
    setIsLoading(true);
    debounceFiltration();
    setIsFiltersUsed(false);
  }, [pageSize, pageNumber, isFiltersUsed]);

  // Юз эффект для пагинации
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    listener(smallQuery, largeQuery);

    smallQuery.addEventListener('change', listener);
    largeQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
      largeQuery.removeEventListener('change', listener);
    };
  }, []);

  // глобальный лоадер
  if (!articles || !categories) {
    return <Loader isCentered />;
  }

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
