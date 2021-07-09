/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */

// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './ReadAndWatch.scss';
import readAndWatchPageTexts from '../../locales/read-and-watch-page-RU';
import {
  BasePage,
  Loader,
  CardCatalog,
  CardArticle,
  CardFilm,
  CardBook,
  AnimatedPageContainer,
} from './index';
import ReadAndWatchSection from '../../components/ReadAndWatchSection/ReadAndWatchSection';
// import CatalogSliderSection from '../../components/CatalogSliderSection';
import { FIGURES } from '../../config/constants';
// import useReadWatch from '../../hooks/useReadWatch'; //!

//! АПИ
// запрос каталога
import getCatalogPageDatа from '../../api/catalog-page';
// запрос видео
import { getVideoPageData } from '../../api/videos-page';
// запрос статей
import getArticlesPageData from '../../api/articles-page';
// запрос фильмов
import { getMoviesPageData } from '../../api/movies-page';
// запрос книг
import { getBooksPageData } from '../../api/books-page';

function ReadAndWatch() {
  //! для использования попапа видео - юзать контекст попапов!
  const { headTitle, headDescription } = readAndWatchPageTexts;

  // определяет сколько объектов показывать в ряду
  const [pageSize, setPageSize] = useState(null);
  // выставляет общее кол во страниц
  // сколько их всего будет при таком размере экрана и количестве элементов на странице
  // const [pageCount, setPageCount] = useState(0);
  const [pageCounter, setPageCounter] = useState({});
  // выставляет текущий номер страницы, на каком мы сейчас
  const [pageNumber, setPageNumber] = useState(0);

  // дата каждой секции
  const [catalogData, setCatalogData] = useState(null);
  const [moviesData, setMoviesData] = useState(null);
  const [videosData, setVideosData] = useState(null);
  const [booksData, setBooksData] = useState(null);
  const [articlesData, setArticlesData] = useState(null);

  // const [isLoading, setIsLoading] = useState(false);
  // const isAllData =
  //   catalogData && moviesData && videosData && booksData && articlesData;

  // при последующих загрузках
  function getCatalog({ elementsPerSection, number }) {
    console.log('getCatalog отдельная функция');
    const offset = pageSize * number;
    // limit = pageSize
    // getCatalogPageDatа({ limit: pageSize, offset })
    getCatalogPageDatа({ limit: pageSize, offset })
      //! тут надо принимать { results, count }
      .then(({ results, count }) => {
        //! count используй
        setCatalogData(results);
      })
      .catch((error) => console.log(error));
  }

  function getMovies({ limit, offset }) {
    // const offset = pageSize * pageNumber;
    // getMoviesPageData({ limit: pageSize, offset })
    getMoviesPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count используй
        setMoviesData(results);
      })
      .catch((error) => console.log(error));
  }

  function getBooks({ limit, offset }) {
    // const offset = pageSize * pageNumber;
    // getBooksPageData({ limit: pageSize, offset })
    getBooksPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count используй
        setBooksData(results);
      })
      .catch((error) => console.log(error));
  }

  function getArticles({ limit, offset }) {
    // const offset = pageSize * pageNumber;
    // getArticlesPageData({ limit: pageSize, offset })
    getArticlesPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count используй
        setArticlesData(results);
      })
      .catch((error) => console.log(error));
  }

  function getVideos({ limit, offset }) {
    // const offset = pageSize * pageNumber;
    // getVideoPageData({ limit: pageSize, offset })
    getVideoPageData({ limit, offset })
      .then(({ results, count }) => {
        //! count используй
        setArticlesData(results);
      })
      .catch((error) => console.log(error));
  }
  console.log('СТРАНИЦА');
  useEffect(() => {
    console.log('юзЕФФЕКТ -- определи размер экрана');
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

    // console.log(pageSize);

    querySizeS.addEventListener('change', listener);
    querySizeM.addEventListener('change', listener);
    querySizeL.addEventListener('change', listener);
    return () => {
      querySizeS.removeEventListener('change', listener);
      querySizeM.removeEventListener('change', listener);
      querySizeL.removeEventListener('change', listener);
    };
  }, []);

  function renderPageContent() {
    if (pageSize) {
      // Справочник
      return (
        <ReadAndWatchSection
          pageSize={pageSize}
          getDataFromApi={getCatalogPageDatа}
          CardTemplate={CardCatalog}
          path="/catalog"
          sectionTitle="Справочник"
        />
      );
    }

    return null;
  }
  // страница создает - 5 компонентов секций (они отличаются только названиями заголовка и ссылкой, а так же датой внутри)
  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="readwatch-page page__section fade-in">
        {renderPageContent()}
        {/* Справочник */}
        {/* Видео */}
        {/* Статьи */}
        {/* Фильмы */}
        {/* Книги */}
      </section>
    </BasePage>
  );
}

export default ReadAndWatch;

/*
 * 1) при первом старте грузим всю дату по размеру экрана (4-3-2-1 элем в слайдере)
 * 2) дальше каждая крутилка(кнопки+сладйер) управляют данными внутри себя сами не затрагивая соседей
 * 3) при любом ресайзе все крутилки не зависимо от того на каком они были положении сбиваются к началу (аналог "загрузили страницу в первый раз").

* pageSize - определяет сколько объектов показывать в ряду
* pageCount - выставляет общее кол во страниц
* pageNumber - выставляет текущий номер страницы, на каком мы сейчас

* LIMIT -- это размер страницы (4-3-2 элемента в ряд). Он же pageSize.
* OFFSET -- это pageSize * pageNumber.
 */

/*

{/* <ReadAndWatchSection
          sectionTitle="Справочник"
          path="/read-watch/catalog" // ссылка на страницу
          elementsPerSection={pageSize}
          data={catalogData}
          getData={getCatalog}
          setData={setCatalogData}
          totalPages={pageCounter?.catalogsTotalPages}
        />
         Видео
         <ReadAndWatchSection
          sectionTitle="Видео"
          path="/read-watch/videos" // ссылка на страницу
          elementsPerSection={pageSize}
          data={videosData}
          getData={getVideos}
          setData={setVideosData}
          totalPages={pageCounter?.moviesTotalPages}
          // handleCardClick={handleVideoClick}
        />
         Статьи
         <ReadAndWatchSection
          sectionTitle="Статьи"
          path="/read-watch/articles" // ссылка на страницу
          elementsPerSection={pageSize}
          data={articlesData}
          getData={getArticles}
          setData={setArticlesData}
          totalPages={pageCounter?.booksTotalPages}
        />
         Фильмы
        <ReadAndWatchSection
          sectionTitle="Фильмы"
          path="/read-watch/movies" // ссылка на страницу
          elementsPerSection={pageSize}
          data={moviesData}
          getData={getMovies}
          setData={setMoviesData}
          totalPages={pageCounter?.articlesTotalPages}
          // handleCardClick={handleVideoClick}
        />
         Книги
        <ReadAndWatchSection
          sectionTitle="Книги"
          path="/read-watch/books" // ссылка на страницу
          elementsPerSection={pageSize}
          data={booksData}
          getData={getBooks}
          setData={setBooksData}
          totalPages={pageCounter?.videosTotalPages}
        />
      */
