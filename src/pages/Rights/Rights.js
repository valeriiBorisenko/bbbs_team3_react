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
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  const getPageData = (tagsStr = '') => {
    const offset = pageSize * pageNumber;

    if (isLoadingPage) {
      Promise.all([
        Api.getRightsData({
          limit: pageSize,
          offset,
        }),
        Api.getRightsTags(),
      ])
        .then(([{ results, count }, tags]) => {
          setArticles(results);
          setPageCount(Math.ceil(count / pageSize));

          const categoriesArr = tags.map((tag) => ({
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

          setIsLoadingPage(false);
        })
        .catch((err) => console.log(err));
      // .finally(setIsLoadingPage(false));
      // При таком варианте полоски гридов загружаются быстрее карточек
    } else {
      Api.getRightsData({
        limit: pageSize,
        offset,
        tags: tagsStr,
      })
        .then(({ results, count }) => {
          setArticles(results);
          setPageCount(Math.ceil(count / pageSize));
        })
        .catch((err) => console.log(err));
    }
  };

  // функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    if (!isLoadingPage) {
      const activeCategories = categories
        .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
        .map((filter) => filter.filter);

      if (activeCategories.length === 0) {
        getPageData();
        selectOneTag(setCategories, ALL_CATEGORIES);
      } else {
        const tagsStr = activeCategories.join(',');
        getPageData(tagsStr);
        deselectOneTag(setCategories, ALL_CATEGORIES);
      }

      setIsFiltersUsed(false);
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

  // Запрос данных для пагинации
  useEffect(() => {
    getPageData();
  }, [pageSize, pageNumber]);

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

  // delay для фильтрации
  const debounceFiltration = useDebounce(handleFiltration, 1500);
  // запуск фильтрации
  useEffect(() => {
    debounceFiltration();
  }, [isFiltersUsed]);

  // Отрисовка страницы
  useEffect(() => {
    setIsLoadingPage(true);
    getPageData();
  }, []);

  // глобальный лоадер
  if (isLoadingPage || !articles || !categories) {
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
      {isFiltersUsed ? (
        <Loader isNested />
      ) : (
        <>
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
