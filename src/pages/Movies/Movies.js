import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '../../hooks';
import { BasePage, TitleH1, PseudoButtonTag } from './index';
import moviesTags from '../../utils/server-responses/movies/movies-tags.json';

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
    </BasePage>
  );
}

export default Movies;
