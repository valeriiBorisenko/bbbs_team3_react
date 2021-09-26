import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import moviesPageTexts from './locales/RU';
import { PopupsContext } from '../../contexts';
import { ERROR_MESSAGES, localStChosenVideo } from '../../config/constants';
import { useFiltrationAndPagination, usePageWidth } from '../../hooks';
import { setLocalStorageData } from '../../hooks/useLocalStorage';
import {
  getMovie,
  getMoviesPageData,
  getMoviesPageFilter,
} from '../../api/movies-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardAnnotation,
  CardFilm,
  Loader,
  Paginate,
  TagsList,
  TitleH1,
} from './index';
import './Movies.scss';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  medium: 12,
  default: 16,
};

const MAX_SCREEN_WIDTH = {
  small: 1216,
  medium: 1451,
};

const { headTitle, headDescription, title, textStubNoData } = moviesPageTexts;

function Movies() {
  const { state } = useLocation();
  const { openPopupVideo } = useContext(PopupsContext);

  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  const [isPageError, setIsPageError] = useState(false);

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getMoviesPageData,
    apiGetFiltersCallback: getMoviesPageFilter,
    apiFilterName: 'tags',
    pageSize,
    pageErrorSetter: setIsPageError,
  };

  const {
    dataToRender,
    filters,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

  // Откртие попапа при переходе из поиска
  useEffect(() => {
    if (state) {
      getMovie(state.id)
        .then((res) => {
          setLocalStorageData(localStChosenVideo, res);
          openPopupVideo();
        })
        .catch(() => setIsPageError(true));
    }
  }, [state]);

  // глобальный лоадер
  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="movies page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );

  // главная функция рендеринга
  function renderPageContent() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }
    return (
      <>
        <TitleH1 title={title} sectionClass="movies__title" />

        {renderFilters()}

        {isFiltersUsed ? <Loader isPaginate /> : renderMoviesContainer()}
      </>
    );
  }

  function renderFilters() {
    if (filters?.length > 1) {
      return (
        <TagsList
          filterList={filters}
          name="movies"
          handleClick={changeFilter}
        />
      );
    }
    return null;
  }

  // контейнер заглушки
  function renderAnimatedContainer() {
    return <AnimatedPageContainer titleText={textStubNoData} />;
  }

  function renderPaginate() {
    if (totalPages > 1) {
      return (
        <Paginate
          sectionClass="cards-section__pagination"
          pageCount={totalPages}
          value={pageIndex}
          onChange={changePageIndex}
        />
      );
    }
    return null;
  }

  // контейнер с фильмами
  function renderMoviesContainer() {
    if (!dataToRender.length && !isPageLoading) {
      return renderAnimatedContainer();
    }
    return (
      <>
        {isPaginationUsed ? (
          <Loader isPaginate />
        ) : (
          <ul className="movies__cards cards-grid cards-grid_content_small-cards fade-in">
            {dataToRender.map((movie) => (
              <li className="card-container scale-in" key={movie.id}>
                <CardFilm data={movie} />
                <CardAnnotation description={movie.annotation} />
              </li>
            ))}
          </ul>
        )}

        {renderPaginate()}
      </>
    );
  }
}

export default Movies;
