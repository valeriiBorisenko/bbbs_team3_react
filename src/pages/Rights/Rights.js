import { useContext, useEffect, useState } from 'react';
import rightsPageTexts from './locales/RU';
import { ErrorsContext, PopupsContext } from '../../contexts';
import { useDebounce } from '../../hooks';
import {
  ALL_CATEGORIES,
  COLORS,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
  FIGURES,
} from '../../config/constants';
import {
  deselectOneTag,
  handleCheckboxBehavior,
  selectOneTag,
} from '../../utils/filter-tags';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import { getRightsData, getRightsTags } from '../../api/rights-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardRights,
  CardsSectionWithLines,
  Loader,
  TagsList,
  TitleH1,
} from './index';
import './Rights.scss';

const PAGE_SIZE_PAGINATE = {
  small: 4,
  medium: 12,
  big: 16,
};

const maxScreenWidth = {
  small: 1399,
  medium: 1640,
};

const { headTitle, headDescription, title, textStubNoData } = rightsPageTexts;

const Rights = () => {
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);

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

  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

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
      .catch(() => {
        if (isFiltersUsed) {
          setError(ERROR_MESSAGES.filterErrorMessage);
          openPopupError();
        } else {
          setIsPageError(true);
        }
      })
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
      .catch(() => setIsPageError(true))
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
    const smallQuery = window.matchMedia(
      `(max-width: ${maxScreenWidth.small}px)`
    );
    const largeQuery = window.matchMedia(
      `(max-width: ${maxScreenWidth.medium}px)`
    );

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
        {isPageError ? (
          <AnimatedPageContainer
            titleText={ERROR_MESSAGES.generalErrorMessage.title}
          />
        ) : (
          <>
            <TitleH1 title={title} sectionClass="rights__title" />
            {categories?.length > 1 && renderTagsContainer()}
            {renderMainContent()}
          </>
        )}
      </section>
    </BasePage>
  );

  // Фильтры страницы
  function renderTagsContainer() {
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
  }

  // Карточки
  function renderCards() {
    return (
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
              getActiveTags={getActiveTags}
            />
          ))}
        </CardsSectionWithLines>
      </>
    );
  }

  // Контент страницы
  function renderMainContent() {
    if ((!articles && !isLoadingPage) || (!categories && !isLoadingPage)) {
      return <AnimatedPageContainer titleText={textStubNoData} />;
    }

    return isFiltersUsed ? <Loader isPaginate /> : renderCards();
  }
};

export default Rights;
