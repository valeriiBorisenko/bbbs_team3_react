import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import moviesPageTexts from './locales/RU';
import { PopupsContext } from '../../contexts';
import { ERROR_MESSAGES, localStChosenVideo } from '../../config/constants';
import { useFiltrationAndPagination, usePageWidth } from '../../hooks';
import { setLocalStorageData } from '../../hooks/useLocalStorage';
import {
  getMovieById,
  getMoviesPageData,
  getMoviesPageFilter,
} from '../../api/movies-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardAnnotation,
  CardFilm,
  Heading,
  Loader,
  Paginate,
  TagsList,
} from './index';
import './Movies.scss';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  medium: 8,
  big: 12,
  default: 16,
};

const MAX_SCREEN_WIDTH = {
  small: 767,
  medium: 1216,
  big: 1451,
};

const { headTitle, headDescription, title, textStubNoData } = moviesPageTexts;

function Movies() {
  const { state } = useLocation();
  const { openPopupVideo } = useContext(PopupsContext);

  // определяет, сколько карточек показывать на странице в зависимости от ширины экрана
  const { pageSize, isSmallQuery } = usePageWidth(
    MAX_SCREEN_WIDTH,
    PAGE_SIZE_PAGINATE
  );
  // стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getMoviesPageData,
    apiGetFiltersCallback: getMoviesPageFilter,
    apiFilterNames: {
      tags: 'tags',
    },
    pageSize,
    setIsPageError,
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
      getMovieById(state.id)
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
    if (isPageError || !dataToRender.length) {
      return renderAnimatedContainer();
    }

    return (
      <>
        <Heading
          level={1}
          type="big"
          content={title}
          sectionClass="movies__title"
        />

        {renderFilters()}

        {isFiltersUsed ? <Loader isPaginate /> : renderMoviesContainer()}
      </>
    );
  }

  function renderAnimatedContainer() {
    return (
      <AnimatedPageContainer
        titleText={
          isPageError
            ? ERROR_MESSAGES.generalErrorMessage.title
            : textStubNoData
        }
      />
    );
  }

  function renderFilters() {
    // учитывается кнопка ВСЕ
    if (filters.length > 2) {
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

  // контейнер с фильмами
  function renderMoviesContainer() {
    return (
      <>
        {isPaginationUsed ? (
          <Loader isPaginate />
        ) : (
          <ul className="movies__cards cards-grid cards-grid_content_small-cards fade-in">
            {dataToRender.map((movie) => (
              <li className="card-container scale-in" key={movie.id}>
                <CardFilm data={movie} isMobile={isSmallQuery} />
                <CardAnnotation description={movie.annotation} />
              </li>
            ))}
          </ul>
        )}

        {renderPaginate()}
      </>
    );
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
}

export default Movies;
