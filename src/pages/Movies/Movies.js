import './Movies.scss';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../../hooks';
import {
  BasePage,
  TitleH1,
  PseudoButtonTag,
  CardFilm,
  CardAnnotation,
} from './index';
import moviesTags from '../../utils/server-responses/movies/movies-tags.json';
import movies from '../../utils/server-responses/movies/movies.json';

function Movies() {
  useScrollToTop();
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
        <div className="tags">
          <ul className="tags__list">
            {moviesTags.map((item) => (
              <li className="tags__list-item" key={item.name}>
                <PseudoButtonTag
                  name={item.name}
                  value={item.filter}
                  title={item.name}
                  isActive={item.isActive}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="movies__cards cards-grid cards-grid_content_small-cards fade-in">
          {movies.results.map((item) => (
            <article className="card-container">
              <Link to="/films" className="main-section__link" key={item.id}>
                <CardFilm data={item} />
              </Link>
              <CardAnnotation description={item.annotation} />
            </article>
          ))}
        </div>
      </section>
    </BasePage>
  );
}

export default Movies;
