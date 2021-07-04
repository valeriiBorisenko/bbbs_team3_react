/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */

// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './ReadAndWatch.scss';
import { BasePage, Loader, AnimatedPageContainer } from './index';
import ReadAndWatchSection from '../../components/ReadAndWatchSection/ReadAndWatchSection';
// import useReadWatch from '../../hooks/useReadWatch'; //!

// АПИ
import getCatalogPageDatа from '../../api/catalog-page';
import { getBooksPageData } from '../../api/books-page';
import { getMoviesPageData } from '../../api/movies-page';

function ReadAndWatch() {
  const [pageSize, setPageSize] = useState(4);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // const { catalogData, videosData, articlesData, moviesData, booksData } =
  //   useReadWatch();

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

  // useEffect(() => {
  //   const offset = pageSize * pageNumber;
  //   useReadWatch({ limit: pageSize, offset });

  // }, [pageSize, pageNumber]);

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
          // data={guideData}
        />
        {/* Видео */}
        <ReadAndWatchSection
          sectionTitle="Видео"
          path="/read-watch/videos" // ссылка на страницу
          elementsPerSection={pageSize}
          // data={videosData}
          // handleCardClick={handleVideoClick}
        />
        {/* Статьи */}
        <ReadAndWatchSection
          sectionTitle="Статьи"
          path="/read-watch/articles" // ссылка на страницу
          elementsPerSection={pageSize}
          // data={articlesData}
        />
        {/* Фильмы */}
        <ReadAndWatchSection
          sectionTitle="Фильмы"
          path="/read-watch/movies" // ссылка на страницу
          elementsPerSection={pageSize}
          // data={moviesData}
          // handleCardClick={handleVideoClick}
        />
        {/* Книги */}
        <ReadAndWatchSection
          sectionTitle="Книги"
          path="/read-watch/books" // ссылка на страницу
          elementsPerSection={pageSize}
          // data={booksData}
        />
      </section>
    </BasePage>
  );
}

export default ReadAndWatch;
