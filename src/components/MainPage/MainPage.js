import './MainPage.scss';
import { Link } from 'react-router-dom';
import CardStub from '../ui/CardStub/CardStub';
import CardPlace from '../ui/CardPlace/CardPlace';
import CardAnnotation from '../ui/CardAnnotation/CardAnnotation';
import CardArticleBig from '../ui/CardArticleBig/CardArticleBig';
import CardVideo from '../ui/CardVideo/CardVideo';
import CardVideoMain from '../ui/CardVideoMain/CardVideoMain';
/* файл для имитации прихода даты с сервера */
import MainPageData from '../../utils/constants';
import Widget from '../ui/Widget/Widget';
import CardQuestion from '../ui/CardQuestion/CardQuestion';
/*------------------------------------------*/

function MainPage() {
  const data = MainPageData;
  return (
    <>
      <section className="lead page__section">
        <article className="card-container card-container_type_identical">
          <CardStub />
          <article className="lead__media" key={data.history.id}>
            <img
              src={data.history.imageUrl}
              alt={data.history.title}
              className="card__media-img"
            />
            <Link to="/stories" className="lead__link">
              {data.history.title}
            </Link>
          </article>
        </article>
      </section>

      <section className="place main-section page__section">
        <article
          className="card-container card-container_type_main-article"
          key={data.place.id}
        >
          <CardPlace
            isChosen={data.place.chosen}
            title={data.place.title}
            name={data.place.name}
            imageUrl={data.place.imageUrl}
            link={data.place.link}
          />
          <CardAnnotation
            isChosen={data.place.chosen}
            info={data.place.info}
            description={data.place.description}
          />
        </article>
      </section>

      <section
        className="articles main-section page__section"
        key={data.articles[0].id}
      >
        <CardArticleBig
          color={data.articles[0].color}
          title={data.articles[0].title}
        />
      </section>

      <section className="movies main-section page__section cards-grid cards-grid_content_small-cards">
        {data.movies.map((item) => (
          <CardVideo
            key={item.id}
            imageUrl={item.imageUrl}
            title={item.title}
            info={item.info}
            link={item.link}
            tags={item.tags}
          />
        ))}
      </section>

      <section className="video main-section page__section">
        <article
          className="card-container card-container_type_main-video"
          key={data.video.id}
        >
          <CardVideoMain
            title={data.video.title}
            info={data.video.info}
            link={data.video.link}
            imageUrl={data.video.imageUrl}
          />
        </article>
      </section>

      <section className="main-questions main-section page__section">
        <article className="card-container card-container_type_iframe">
          <Widget
            title="Facebook"
            link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs=timeline&width=630&height=630&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
          />
          <div className="main-questions__container">
            {data.questions.map((item) => (
              <CardQuestion key={item.id} title={item.title} tags={item.tags} />
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export default MainPage;
