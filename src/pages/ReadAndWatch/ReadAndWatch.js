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
  // const [pageCounter, setPageCount] = useState({});
  const [pageNumber, setPageNumber] = useState(0);

  // дата каждой секции
  const [catalogData, setCatalogData] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [videosData, setVideosData] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [articlesData, setArticlesData] = useState([]);

  // при последующих загрузках
  function getCatalog({ limit, offset }) {
    getCatalogPageDatа({ limit, offset })
      //! тут надо принимать { results, count }
      .then(({ results, count }) => {
        //! count
        setCatalogData(results);
      })
      .catch((error) => console.log(error));
  }

  function getMovies({ limit, offset }) {
    getMoviesPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count
        setMoviesData(results);
      })
      .catch((error) => console.log(error));
  }

  function getBooks({ limit, offset }) {
    getBooksPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count
        setBooksData(results);
      })
      .catch((error) => console.log(error));
  }

  function getArticles({ limit, offset }) {
    getArticlesPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count
        setArticlesData(results);
      })
      .catch((error) => console.log(error));
  }

  function getVideos({ limit, offset }) {
    getVideosPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count
        setArticlesData(results);
      })
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

  function initialLoading({ limit, offset }) {
    Promise.all([
      getCatalogPageDatа({ limit, offset }),
      getMoviesPageData({ limit, offset }),
      getBooksPageData({ limit, offset }),
      getArticlesPageData({ limit, offset }),
      getVideosPageData({ limit, offset }),
    ])
      .then(([catalogs, movies, books, articles, videos]) => {
        setCatalogData(catalogs);
        setMoviesData(movies);
        setBooksData(books);
        setArticlesData(articles);
        setVideosData(videos);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    const offset = pageSize * pageNumber;
    // console.log({ limit: pageSize, offset });
    initialLoading({ limit: pageSize, offset });
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
          getData={getCatalog}
          setData={setCatalogData}
        />
        {/* Видео */}
        <ReadAndWatchSection
          sectionTitle="Видео"
          path="/read-watch/videos" // ссылка на страницу
          elementsPerSection={pageSize}
          data={videosData}
          getData={getVideos}
          setData={setVideosData}
          // handleCardClick={handleVideoClick}
        />
        {/* Статьи */}
        <ReadAndWatchSection
          sectionTitle="Статьи"
          path="/read-watch/articles" // ссылка на страницу
          elementsPerSection={pageSize}
          data={articlesData}
          getData={getArticles}
          setData={setArticlesData}
        />
        {/* Фильмы */}
        <ReadAndWatchSection
          sectionTitle="Фильмы"
          path="/read-watch/movies" // ссылка на страницу
          elementsPerSection={pageSize}
          data={moviesData}
          getData={getMovies}
          setData={setMoviesData}
          // handleCardClick={handleVideoClick}
        />
        {/* Книги */}
        <ReadAndWatchSection
          sectionTitle="Книги"
          path="/read-watch/books" // ссылка на страницу
          elementsPerSection={pageSize}
          data={booksData}
          getData={getBooks}
          setData={setBooksData}
        />
      </section>
    </BasePage>
  );
}

export default ReadAndWatch;
