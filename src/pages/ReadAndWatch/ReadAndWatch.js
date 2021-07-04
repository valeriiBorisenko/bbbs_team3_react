/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */

// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './ReadAndWatch.scss';
import { BasePage, Loader, AnimatedPageContainer } from './index';
import ReadAndWatchSection from '../../components/ReadAndWatchSection/ReadAndWatchSection';
// import useReadWatch from '../../hooks/useReadWatch'; //!

//! АПИ
// запрос каталога
import getCatalogPageDatа from '../../api/catalog-page';
// запрос видео //! внести
import getVideosPageData from '../../api/videos-page';
// запрос статей
import getArticlesPageData from '../../api/articles-page';
// запрос фильмов
import { getMoviesPageData } from '../../api/movies-page';
// запрос книг
import { getBooksPageData } from '../../api/books-page';

function ReadAndWatch() {
  const [pageSize, setPageSize] = useState(4);
  // const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // дата каждой секции
  const [catalogData, setCatalogData] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  // видео не хватает
  const [booksData, setBooksData] = useState([]);
  const [articlesData, setArticlesData] = useState([]);

  function getCatalog({ limit, offset }) {
    getCatalogPageDatа({ limit, offset })
      //! тут надо принимать { results, count }
      .then((catalogs) => setCatalogData(catalogs))
      .catch((error) => console.log(error));
  }

  function getMovies({ limit, offset }) {
    getMoviesPageData({ limit, offset })
      .then((movies) => setMoviesData(movies))
      .catch((error) => console.log(error));
  }

  function getBooks({ limit, offset }) {
    getBooksPageData({ limit, offset })
      .then((books) => setBooksData(books))
      .catch((error) => console.log(error));
  }

  function getArticles({ limit, offset }) {
    getArticlesPageData({ limit, offset })
      .then((articles) => setArticlesData(articles))
      .catch((error) => console.log(error));
  }

  // стейты 5 страниц

  // const { catalogData, moviesData, booksData } = useReadWatch();

  useEffect(() => {
    // 1 элемент в ряду
    const querySizeS = window.matchMedia('(max-width: 820px)');
    // 2 элемента в ряду
    const querySizeM = window.matchMedia('(max-width: 1120px)');
    // 3 элемента в ряду
    const querySizeL = window.matchMedia('(max-width: 1440px)');
    // больше 1440px будет 4 элемента в ряду

    const listener = () => {
      if (querySizeS.matches) {
        setPageSize(1);
      } else if (querySizeM.matches) {
        setPageSize(2);
      } else if (querySizeL.matches) {
        setPageSize(3);
      } else {
        setPageSize(4);
      }
    };
    listener();

    console.log(pageSize);

    querySizeS.addEventListener('change', listener);
    querySizeM.addEventListener('change', listener);
    querySizeL.addEventListener('change', listener);
    return () => {
      querySizeS.removeEventListener('change', listener);
      querySizeM.removeEventListener('change', listener);
      querySizeL.removeEventListener('change', listener);
    };
  }, []);
  console.log(pageSize);

  function getPageDataOnStart({ limit, offset }) {
    Promise.all([
      getCatalog({ limit, offset }),
      getMovies({ limit, offset }),
      getBooks({ limit, offset }),
      getArticles({ limit, offset }),
    ])
      .then(([catalogs, movies, books, articles]) => {
        setCatalogData(catalogs);
        setMoviesData(movies);
        setBooksData(books);
        setArticlesData(articles);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    const offset = pageSize * pageNumber;
    // console.log({ limit: pageSize, offset });
    getPageDataOnStart({ limit: pageSize, offset });
  }, []);

  return (
    <BasePage>
      <Helmet>
        <title>Ответы на вопросы</title>
        <meta
          name="description"
          content="Страница с ответами на основные вопросы"
        />
      </Helmet>
      <section className="readwatch-page page__section fade-in">
        {/* Справочник */}
        <ReadAndWatchSection
          sectionTitle="Справочник"
          path="/read-watch/catalog" // ссылка на страницу
          elementsPerSection={pageSize}
          data={catalogData}
        />
        {/* //! Видео */}
        {/* <ReadAndWatchSection
          sectionTitle="Видео"
          path="/read-watch/videos" // ссылка на страницу
          elementsPerSection={pageSize}
          // data={videosData}
          // handleCardClick={handleVideoClick}
        /> */}
        {/* //! Статьи */}
        <ReadAndWatchSection
          sectionTitle="Статьи"
          path="/read-watch/articles" // ссылка на страницу
          elementsPerSection={pageSize}
          data={articlesData}
        />
        {/* Фильмы */}
        <ReadAndWatchSection
          sectionTitle="Фильмы"
          path="/read-watch/movies" // ссылка на страницу
          elementsPerSection={pageSize}
          data={moviesData}
          // handleCardClick={handleVideoClick}
        />
        {/* Книги */}
        <ReadAndWatchSection
          sectionTitle="Книги"
          path="/read-watch/books" // ссылка на страницу
          elementsPerSection={pageSize}
          data={booksData}
        />
      </section>
    </BasePage>
  );
}

export default ReadAndWatch;
