import './Movies.scss';
import { useEffect, useState, useContext } from 'react';
import moviesPageTexts from '../../locales/movies-page-RU';
import { useScrollToTop, useDebounce } from '../../hooks/index';
import { getMoviesPageData, getMoviesPageFilter } from '../../api/movies-page';
import {
  BasePage,
  TitleH1,
  CardFilm,
  CardAnnotation,
  Loader,
  AnimatedPageContainer,
  TagsList,
} from './index';
import Paginate from '../../components/utils/Paginate/Paginate';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import {
  ALL_CATEGORIES,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
} from '../../config/constants';
import {
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { ErrorsContext, PopupsContext } from '../../contexts/index';

const PAGE_SIZE_PAGINATE = {
  mobile: 2,
  tablet: 4,
  medium: 12,
  big: 16,
};

const { headTitle, headDescription, title, textStubNoData } = moviesPageTexts;

function Movies() {
  useScrollToTop();

  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);

  // Загрузка данных
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);
  // Стейты с данными Фильмов, Теги
  const [moviesPageData, setMoviesPageData] = useState(null);
  const [categories, setCategories] = useState(null);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  // Стейт ошибки
  const [pageError, setPageError] = useState(false);

  const getActiveTags = () => {
    if (categories) {
      return categories
        .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
        .map((filter) => filter.filter)
        .join(',');
    }
    return null;
  };

  const getMoviesData = (activeCategories) => {
    const offset = isFiltersUsed ? 0 : pageSize * pageNumber;
    const activeTags = activeCategories || getActiveTags();

    getMoviesPageData({
      limit: pageSize,
      offset,
      tags: activeTags,
    })
      .then(({ results, count }) => {
        setPageCount(Math.ceil(count / pageSize));
        return results;
      })
      .then((results) => setMoviesPageData(results))
      .catch((err) => {
        setPageError(true);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingPaginate(false);
        setIsFiltersUsed(false);
      });
  };

  const getMoviesFilter = () => {
    getMoviesPageFilter()
      .then((tags) => {
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
      .catch((err) => {
        if (isFiltersUsed) {
          setError({
            title: ERROR_MESSAGES.filterErrorMessage.title,
            button: ERROR_MESSAGES.filterErrorMessage.button,
          });
          openPopupError();
          console.log(err);
        } else {
          setPageError(true);
          console.log(err);
        }
      });
  };

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
    setIsFiltersUsed(true);
  };

  // функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    if (categories && isFiltersUsed) {
      const activeCategories = getActiveTags();

      if (activeCategories.length === 0) {
        selectOneTag(setCategories, ALL_CATEGORIES);
      }
      getMoviesData(activeCategories);
    }
  };

  /// Фильтрация с делэем
  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getMoviesData, DELAY_DEBOUNCE);
  useEffect(() => {
    if (isFiltersUsed) {
      debounceFiltration();
    }
  }, [isFiltersUsed]);

  // Первая отрисовка страницы + переход по страницам пагинации
  useEffect(() => {
    if (isLoading && pageSize) {
      getMoviesData();
      getMoviesFilter();
    }

    if (!isLoading && !isFiltersUsed) {
      setIsLoadingPaginate(true);
      debouncePaginate();
    }
  }, [pageSize, pageNumber]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 900px)');
    const smallQuery = window.matchMedia('(max-width: 1216px)');
    const largeQuery = window.matchMedia('(max-width: 1451px)');

    const listener = () => {
      if (mobileQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.mobile);
      } else if (smallQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.tablet);
      } else if (largeQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.medium);
      } else {
        setPageSize(PAGE_SIZE_PAGINATE.big);
      }
    };
    listener();
    mobileQuery.addEventListener('change', listener);
    smallQuery.addEventListener('change', listener);
    largeQuery.addEventListener('change', listener);

    return () => {
      mobileQuery.removeEventListener('change', listener);
      smallQuery.removeEventListener('change', listener);
      largeQuery.removeEventListener('change', listener);
    };
  }, []);

  // контейнер заглушки
  function renderAnimatedContainer() {
    return <AnimatedPageContainer titleText={textStubNoData} />;
  }

  // контейнер с фильмами
  const renderMoviesContainer = () => {
    if (!moviesPageData && !isLoading) {
      return renderAnimatedContainer();
    }
    return (
      <>
        {isLoadingPaginate ? (
          <Loader isNested />
        ) : (
          <ul className="movies__cards cards-grid cards-grid_content_small-cards fade-in">
            {moviesPageData.map((movie) => (
              <li className="card-container scale-in" key={movie.id}>
                <CardFilm
                  data={movie}
                  pageCount={pageCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
                <CardAnnotation description={movie.annotation} />
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <Paginate
            sectionClass="cards-section__pagination"
            pageCount={pageCount}
            value={pageNumber}
            onChange={setPageNumber}
          />
        )}
      </>
    );
  };
  // главная функция рендеринга
  const renderPageContent = () => {
    if (pageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }
    return (
      <>
        <TitleH1 title={title} sectionClass="movies__title" />

        {/* рендер фильтров */}
        {categories?.length > 1 && (
          <TagsList
            filterList={categories}
            name="tag"
            handleClick={changeCategory}
          />
        )}

        {/* рендерим фильмы */}
        {isFiltersUsed ? <Loader isNested /> : renderMoviesContainer()}
      </>
    );
  };

  // глобальный лоадер
  if (isLoading) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="movies page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

export default Movies;
