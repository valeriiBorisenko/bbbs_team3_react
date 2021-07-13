/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import './ReadAndWatch.scss';
import readAndWatchPageTexts from '../../locales/read-and-watch-page-RU';
import {
  BasePage,
  Loader,
  CardCatalog,
  CardArticle,
  CardFilm,
  CardBook,
} from './index';
import {
  CATALOG_URL,
  ARTICLES_URL,
  MOVIES_URL,
  VIDEO_URL,
  BOOKS_URL,
} from '../../config/routes';
import {
  RAW_DELAY_SLIDER_TRANSITION,
  RAW_SLIDER_PADDINGS,
  RAW_SLIDER_BREAKPOINTS,
  ELEMS_PER_SLIDE,
} from './constants';
import ReadAndWatchSection from '../../components/ReadAndWatchSection/ReadAndWatchSection';
// АПИ
import getCatalogPageDatа from '../../api/catalog-page';
import { getVideoPageData } from '../../api/videos-page';
import getArticlesPageData from '../../api/articles-page';
import { getMoviesPageData } from '../../api/movies-page';
import { getBooksPageData } from '../../api/books-page';

// константы страницы
const { headTitle, headDescription, pageTitles, paragraphNoContent } =
  readAndWatchPageTexts;
const { catalogTitle, articlesTitle, moviesTitle, videosTitle, booksTitle } =
  pageTitles;
const { S, M, L } = RAW_SLIDER_BREAKPOINTS;
const { one, two, three, four } = ELEMS_PER_SLIDE;

function ReadAndWatch() {
  // определяет сколько объектов показывать в ряду
  const [pageSize, setPageSize] = useState(null);
  console.log('ReadAndWatch');

  // общая загрузка
  // const [catalogDataLoading, setCatalogDataLoaded] = useState(true);
  // const [articlesDataLoading, setArticlesDataLoaded] = useState(true);
  // const [moviesDataLoading, setMoviesDataLoaded] = useState(true);
  // const [booksDataLoading, setBooksDataLoaded] = useState(true);
  // const [videosDataLoading, setVideosDataLoaded] = useState(true);
  // const isDataFinished =
  //   catalogDataLoaded &&
  //   articlesDataLoaded &&
  //   moviesDataLoaded &&
  //   booksDataLoaded &&
  //   videosDataLoaded;
  // console.log('isAllDataLoaded', isAllDataLoaded);

  //! чтобы сделать лоадер делаем 5 стейтов и спускаем в каждую секцию сеттер типо isCatalogDataLoaded, как только все 5 станут ТРУ глобальный лоадер можно вырубать

  useEffect(() => {
    // 1 элемент в ряду
    const querySizeS = window.matchMedia(`(max-width: ${S}px)`);
    // 2 элемента в ряду
    const querySizeM = window.matchMedia(`(max-width: ${M}px)`);
    // 3 элемента в ряду
    const querySizeL = window.matchMedia(`(max-width: ${L}px)`);
    // больше 1440px будет 4 элемента в ряду

    const listener = () => {
      if (querySizeS.matches) {
        setPageSize(one);
      } else if (querySizeM.matches) {
        setPageSize(two);
      } else if (querySizeL.matches) {
        setPageSize(three);
      } else {
        setPageSize(four);
      }
    };
    listener();

    querySizeS.addEventListener('change', listener);
    querySizeM.addEventListener('change', listener);
    querySizeL.addEventListener('change', listener);
    return () => {
      querySizeS.removeEventListener('change', listener);
      querySizeM.removeEventListener('change', listener);
      querySizeL.removeEventListener('change', listener);
    };
  }, []);

  function renderUniqueSliderSections() {
    return (
      <>
        <ReadAndWatchSection
          breakpoints={RAW_SLIDER_BREAKPOINTS}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getCatalogPageDatа}
          CardTemplateComponent={CardCatalog}
          path={CATALOG_URL}
          sectionTitle={catalogTitle}
          // setDataLoaded={setCatalogDataLoaded}
        />
        <ReadAndWatchSection
          breakpoints={RAW_SLIDER_BREAKPOINTS}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getVideoPageData}
          CardTemplateComponent={CardFilm}
          path={VIDEO_URL}
          sectionTitle={videosTitle}
          // setDataLoaded={setVideosDataLoaded}
        />
        <ReadAndWatchSection
          breakpoints={RAW_SLIDER_BREAKPOINTS}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getArticlesPageData}
          CardTemplateComponent={CardArticle}
          path={ARTICLES_URL}
          sectionTitle={articlesTitle}
          // setDataLoaded={setArticlesDataLoaded}
        />
        <ReadAndWatchSection
          breakpoints={RAW_SLIDER_BREAKPOINTS}
          elemaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getMoviesPageData}
          CardTemplateComponent={CardFilm}
          path={MOVIES_URL}
          sectionTitle={moviesTitle}
          // setDataLoaded={setMoviesDataLoaded}
        />
        <ReadAndWatchSection
          breakpoints={RAW_SLIDER_BREAKPOINTS}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getBooksPageData}
          CardTemplateComponent={CardBook}
          path={BOOKS_URL}
          sectionTitle={booksTitle}
          // setDataLoaded={setBooksDataLoaded}
        />
      </>
    );
  }

  // if (!isAllDataLoaded) {
  //   return <Loader isCentered />;
  // }

  // useEffect(() => {
  //   renderUniqueSliderSections();
  // }, []);

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="readwatch-page page__section fade-in">
        {pageSize && renderUniqueSliderSections()}
      </section>
    </BasePage>
  );
}

export default ReadAndWatch;
