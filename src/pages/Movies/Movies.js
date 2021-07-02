import './Movies.scss';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useScrollToTop, useDebounce } from '../../hooks';
import Api from '../../utils/api';
import { BasePage, TitleH1, CardFilm, CardAnnotation } from './index';
import Paginate from '../../components/utils/Paginate/Paginate';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import { DELAY_DEBOUNCE } from '../../config/constants';
import { handleRadioBehavior, renderFilterTags } from '../../utils/filter-tags';

function Movies() {
  useScrollToTop();

  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [moviesPageData, setMoviesPageData] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const offset = pageSize * pageNumber;
    Api.getMoviesPageData({ limit: pageSize, offset }).then(
      ({ results, count }) => {
        setMoviesPageData(results);
        setPageCount(Math.ceil(count / pageSize));
        setIsLoading(false);
      }
    );
  }, [pageSize, pageNumber]);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(4);
      } else if (largeQuery.matches) {
        setPageSize(12);
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

  useEffect(() => {
    Api.getActiveMoviesTags()
      .then((activeMovies) => {
        const customFilters = activeMovies.map((activeMovie) => {
          const filterName = changeCaseOfFirstLetter(activeMovie.name);
          return {
            isActive: false,
            name: filterName,
            filter: activeMovie,
          };
        });
        setFilters(customFilters);
      })
      .catch((error) => console.log(error));
  }, []);

  function handleFiltration() {
    if (isFiltersUsed) {
      const activeFilter = filters.find((filter) => filter.isActive);
      console.log(activeFilter);
      if (activeFilter) {
        console.log('activeFilter IF');
        Api.getActualMoviesForFilter(activeFilter.filter)
          .then((movies) => setMoviesPageData(movies))
          .catch((error) => console.log(error));
      } else {
        setMoviesPageData();
      }
    }
  }

  function handleFilterClick(inputValue, isChecked) {
    handleRadioBehavior(setFilters, { inputValue, isChecked });
    setIsFiltersUsed(true);
  }

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  useEffect(() => {
    if (isFiltersUsed) {
      debounceFiltration();
    }
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  function renderTagsContainder() {
    return (
      <div className="tags fade-in">
        <ul className="tags__list">
          {renderFilterTags(filters, 'movies', handleFilterClick)}
        </ul>
      </div>
    );
  }

  return (
    <BasePage>
      <Helmet>
        <title>Фильмы</title>
        <meta
          name="description"
          content="Подборка фильмов, которые можно посмотреть, с аннотацией к ним"
        />
      </Helmet>
      <section className="movies page__section fade-in">
        <TitleH1 title="Фильмы" />
        {filters?.length > 1 && renderTagsContainder()}
        {!isLoading && (
          <ul className="movies__cards cards-grid cards-grid_content_small-cards fade-in">
            {moviesPageData.map((item) => (
              <li className="card-container" key={item.id}>
                <CardFilm
                  data={item}
                  pageCount={pageCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
                <CardAnnotation description={item.annotation} />
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
      </section>
    </BasePage>
  );
}

export default Movies;
