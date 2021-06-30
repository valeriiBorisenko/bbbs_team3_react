/* eslint-disable no-undef */
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
      <section className="lead page__section">
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
      </section>
      <section className="cards-grid cards-grid_content_small-cards page__section">
        {movies.results.map((item) => (
          <article className="card-container card-pagination">
            <Link
              to="/films"
              className="main-section__link card-pagination_page_main"
              key={item.id}
            >
              <CardFilm data={item} />
            </Link>
            <CardAnnotation description={item.annotation} />
          </article>
        ))}
      </section>
    </BasePage>
  );
}

export default Movies;
