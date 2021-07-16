import React, { useState, useEffect } from 'react';
import rightsPageTexts from '../../locales/rights-page-RU';
import './Rights.scss';
import {
  ALL_CATEGORIES,
  FIGURES,
  COLORS,
  DELAY_DEBOUNCE,
} from '../../config/constants';
import {
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
  TagsList,
} from './index';

const PAGE_SIZE_PAGINATE = {
  small: 4,
  medium: 9,
  big: 16,
};

const { headTitle, headDescription, title, textStubNoData } = rightsPageTexts;

const Rights = () => {
  useScrollToTop();

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // Стейты с данными
  const [articles, setArticles] = useState(null);
  const [categories, setCategories] = useState(null);

  // Стейты состояний
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

  // Функция состояний чекбоксов фильтра
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
    setIsFiltersUsed(true);
  };

  // Фильтры страницы
  const renderTagsContainer = () => {
    if (articles && !isLoadingPage) {
      return (
        <TagsList
          filterList={categories}
          name="rights"
          handleClick={changeCategory}
        />
      );
    }
    return null;
  };

  // Карточки с видео страницы
  const renderCards = () => (
    <>
      <CardsSectionWithLines
        pageCount={pageCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        isLoading={isLoadingPaginate}
        dataLength={articles.length}
        pageSize={pageSize}
      >
        {articles.map((item, i) => (
          <CardRights
            key={item?.id}
            sectionClass="cards-section__item scale-in"
            title={item?.title}
            tags={item?.tags}
            shape={FIGURES[i % FIGURES.length]}
            color={COLORS[i % COLORS.length]}
            id={item?.id}
          />
        ))}
      </CardsSectionWithLines>
    </>
  );

  // Контент страницы
  const renderMainContent = () => {
    if ((!articles && !isLoadingPage) || (!categories && !isLoadingPage)) {
      return <AnimatedPageContainer titleText={textStubNoData} />;
    }

    return isFiltersUsed ? <Loader isNested /> : renderCards();
  };

  // Сортировка значений Тэгов для АПИ
  const getActiveTags = () => {
    if (categories) {
      return categories
        .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
        .map((filter) => filter.filter)
        .join(',');
    }
    return null;
  };

  // Функция обработки запроса АПИ с карточками
  const getArticlesData = (activeCategories) => {
    const offset = isFiltersUsed ? 0 : pageSize * pageNumber;
    const activeTags = activeCategories || getActiveTags();

    getRightsData({
      limit: pageSize,
      offset,
      tags: activeTags,
    })
      .then(({ results, count }) => {
        setPageCount(Math.ceil(count / pageSize));
        return results;
      })
      .then((results) => setArticles(results))
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPaginate(false);
        setIsFiltersUsed(false);
      });
  };

  // Функция обработки запросов АПИ для первой загрузки страницы
  // Промис олл для плавного отображения
  const getFirstPageData = () => {
    Promise.all([
      getRightsTags(),
      getRightsData({
        limit: pageSize,
      }),
    ])
      .then(([tags, { results, count }]) => {
        setPageCount(Math.ceil(count / pageSize));
        setArticles(results);

        const categoriesArr = tags.map((tag) => ({
          filter: tag?.slug.toLowerCase(),
          name: changeCaseOfFirstLetter(tag?.name),
          isActive: false,
        }));

        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...categoriesArr,
        ]);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPage(false);
      });
  };

  // Функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    if (categories && isFiltersUsed) {
      const activeCategories = getActiveTags();

      if (activeCategories.length === 0) {
        selectOneTag(setCategories, ALL_CATEGORIES);
      }
      getArticlesData(activeCategories);
    }
  };

  // Дэлеи для динамических запросов
  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getArticlesData, DELAY_DEBOUNCE);
  // Динамические фильтры
  useEffect(() => {
    if (isFiltersUsed) {
      debounceFiltration();
    }
  }, [isFiltersUsed]);

  // Загрузка страницы, динамическая пагинация, динамический ресайз
  useEffect(() => {
    if (isLoadingPage && pageSize) {
      getFirstPageData();
    }

    if (!isLoadingPage && !isFiltersUsed) {
      setIsLoadingPaginate(true);
      debouncePaginate();
    }
  }, [pageSize, pageNumber]);

  // Резайз пагинации при первой загрузке
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.small);
      } else if (largeQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.medium);
      } else {
        setPageSize(PAGE_SIZE_PAGINATE.big);
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

  // Лоадер при загрузке страницы
  if (isLoadingPage) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="rights page__section fade-in">
        <TitleH1 title={title} sectionClass="rights__title" />
        {categories?.length > 1 && renderTagsContainer()}
        {renderMainContent()}
      </section>
    </BasePage>
  );
};

export default Rights;
