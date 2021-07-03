import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './Rights.scss';
import {
  ALL_CATEGORIES,
  FIGURES,
  COLORS,
  DELAY_DEBOUNCE,
} from '../../config/constants';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import { useScrollToTop, useDebounce } from '../../hooks/index';
import { getRightsData, getRightsTags } from '../../api/rights-page';
import {
  BasePage,
  Loader,
  TitleH1,
  CardRights,
  CardsSectionWithLines,
  AnimatedPageContainer,
} from './index';

const TEXT_STUB_NOPE_DATA =
  'В данный момент страница со статьями о правах детей пуста. Возвращайтесь позже!';

const Rights = () => {
  useScrollToTop();

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // Стейты с данными Статьи, Теги
  const [articles, setArticles] = useState(null);
  const [categories, setCategories] = useState(null);

  // Загрузка данных
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // Загрузка данных при переключении пагинации
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    }
    setIsFiltersUsed(true);
  };

  // Заглушка на страницу
  const getPageStub = (text) => (
    <AnimatedPageContainer titleText={text} buttonText="Вернуться на главную" />
  );

  // отрисовка массива фильтров
  const renderTagsContainer = () => (
    <div className="tags">
      <ul className="tags__list">
        {renderFilterTags(categories, 'checkbox', changeCategory)}
      </ul>
    </div>
  );

  const renderCards = () => (
    <>
      <CardsSectionWithLines
        pageCount={pageCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        sectionClass="rights page__section"
        isLoading={isLoadingPaginate}
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
  );

  // отрисовка контента страницы
  const renderMainContent = () => {
    // залогинен и нет ивентов
    if (!articles && !isLoadingPage) {
      return getPageStub(TEXT_STUB_NOPE_DATA);
    }

    if (articles && categories && !isLoadingPage) {
      return isFiltersUsed ? <Loader isNested /> : renderCards();
    }
    return null;
  };

  const getArticlesData = (tagsStr = '', offset = 0) => {
    getRightsData({
      limit: pageSize,
      offset,
      tags: tagsStr,
    })
      .then(({ results, count }) => {
        setArticles(results);
        setPageCount(Math.ceil(count / pageSize));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPage(false);
        setIsFiltersUsed(false);
        setIsLoadingPaginate(false);
      });
  };

  const getArticlesTags = () => {
    getRightsTags()
      .then((tags) => {
        const categoriesArr = tags.map((tag) => ({
          filter: tag.slug.toLowerCase(),
          name: changeCaseOfFirstLetter(tag.name),
          isActive: false,
        }));

        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...categoriesArr,
        ]);
      })
      .catch((err) => console.log(err));
  };

  const getPageData = (tagsStr) => {
    const offset = pageSize * pageNumber;

    if (isLoadingPage) {
      getArticlesData();
      getArticlesTags();
    } else if (isFiltersUsed) {
      getArticlesData(tagsStr);
    } else {
      getArticlesData(tagsStr, offset);
    }
  };

  // функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    if (!isLoadingPage && isFiltersUsed) {
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
    }
  };

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  // запуск фильтрации
  useEffect(() => {
    debounceFiltration();
  }, [isFiltersUsed]);

  // Отрисовка страницы
  useEffect(() => {
    setIsLoadingPaginate(true);
    getPageData();
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

  // глобальный лоадер
  if (isLoadingPage) {
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
        {categories?.length > 1 && renderTagsContainer()}
      </section>
      {renderMainContent()}
    </BasePage>
  );
};

export default Rights;
