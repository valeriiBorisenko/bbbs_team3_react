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
import ReadAndWatchSection from '../../components/ReadAndWatchSection/ReadAndWatchSection';
// АПИ
import getCatalogPageDatа from '../../api/catalog-page';
import { getVideoPageData } from '../../api/videos-page';
import getArticlesPageData from '../../api/articles-page';
import { getMoviesPageData } from '../../api/movies-page';
import { getBooksPageData } from '../../api/books-page';

function ReadAndWatch() {
  const { headTitle, headDescription } = readAndWatchPageTexts;

  // определяет сколько объектов показывать в ряду
  const [pageSize, setPageSize] = useState(null);

  //! чтобы сделать лоадер делаем 5 стейтов и спускаем в каждую секцию сеттер типо isCatalogDataLoaded, как только все 5 станут ТРУ глобальный лоадер можно вырубать

  useEffect(() => {
    console.log('юзЕФФЕКТ -- определи размер экрана');
    // 1 элемент в ряду
    const querySizeS = window.matchMedia('(max-width: 700px)');
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
      return (
        <>
          <ReadAndWatchSection
            pageSize={pageSize}
            getDataFromApi={getCatalogPageDatа}
            CardTemplateComponent={CardCatalog}
            path={CATALOG_URL}
            sectionTitle="Справочник"
          />
          <ReadAndWatchSection
            pageSize={pageSize}
            getDataFromApi={getVideoPageData}
            CardTemplateComponent={CardFilm}
            path={VIDEO_URL}
            sectionTitle="Видео"
          />
          <ReadAndWatchSection
            pageSize={pageSize}
            getDataFromApi={getArticlesPageData}
            CardTemplateComponent={CardArticle}
            path={ARTICLES_URL}
            sectionTitle="Статьи"
          />
          <ReadAndWatchSection
            pageSize={pageSize}
            getDataFromApi={getMoviesPageData}
            CardTemplateComponent={CardFilm}
            path={MOVIES_URL}
            sectionTitle="Фильмы"
          />
          <ReadAndWatchSection
            pageSize={pageSize}
            getDataFromApi={getBooksPageData}
            CardTemplateComponent={CardBook}
            path={BOOKS_URL}
            sectionTitle="Книги"
          />
        </>
      );
    }

    return null;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="readwatch-page page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

export default ReadAndWatch;
