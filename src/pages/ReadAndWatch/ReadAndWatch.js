/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet-async';
import './ReadAndWatch.scss';
import {
  BasePage,
  Loader,
  TitleH3,
  CardCatalog,
  CardArticle,
  CardFilm,
  CardsSectionWithLines,
  AnimatedPageContainer,
} from './index';
import ReadAndWatchSection from '../../components/ReadAndWatchSection/ReadAndWatchSection';

function ReadAndWatch() {
  return (
    <BasePage>
      <Helmet>
        <title>Ответы на вопросы</title>
        <meta
          name="description"
          content="Страница с ответами на основные вопросы"
        />
      </Helmet>
      <section className="questions-page page__section fade-in">
        {/* Справочник */}
        <ReadAndWatchSection
          sectionTitle="Справочник"
          path="/read-watch/catalog" // ссылка на страницу
          data={guideData}
        />
        {/* Видео */}
        <ReadAndWatchSection
          sectionTitle="Видео"
          path="/read-watch/videos" // ссылка на страницу
          data={videosData}
          // handleCardClick={handleVideoClick}
        />
        {/* Статьи */}
        <ReadAndWatchSection
          sectionTitle="Статьи"
          path="/read-watch/articles" // ссылка на страницу
          data={articlesData}
        />
        {/* Фильмы */}
        <ReadAndWatchSection
          sectionTitle="Фильмы"
          path="/read-watch/movies" // ссылка на страницу
          data={moviesData}
          handleVideoClick={handleVideoClick}
        />
        {/* Книги */}
        <ReadAndWatchSection
          sectionTitle="Книги"
          path="/read-watch/books" // ссылка на страницу
          data={booksData}
        />
      </section>
    </BasePage>
  );
}

export default ReadAndWatch;
