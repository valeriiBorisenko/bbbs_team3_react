import './MainPage.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CardStub from '../ui/CardStub/CardStub';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
import CardPlace from '../ui/CardPlace/CardPlace';
import CardAnnotation from '../ui/CardAnnotation/CardAnnotation';
import CardArticleBig from '../ui/CardArticleBig/CardArticleBig';
import CardFilm from '../ui/CardFilm/CardFilm';
import CardVideoMain from '../ui/CardVideoMain/CardVideoMain';
import Widget from '../ui/Widget/Widget';
import CardQuestion from '../ui/CardQuestion/CardQuestion';
/* файл для имитации прихода даты с сервера */
import { MainPageData } from '../../utils/constants';
import Card from '../ui/Card/Card';
/*------------------------------------------*/

function MainPage({ isAuthorized }) {
  const data = MainPageData;
  return (
    <>
      <section className="lead page__section">
        <div className="card-container card-container_type_identical">
          {isAuthorized ? (
            <CardCalendar
              key={data.event.id}
              tags={data.event.tags}
              startAt={data.event.startAt}
              endAt={data.event.endAt}
              title={data.event.title}
              address={data.event.address}
              contact={data.event.contact}
              remainSeats={data.event.remainSeats}
              description={data.event.description}
              isBooked={!data.event.booked}
            />
          ) : (
            <CardStub />
          )}
          <Card sectionClass="lead__media" key={data.history.id}>
            <img
              src={data.history.imageUrl}
              alt={data.history.title}
              className="card__media-img"
            />
            <Link to="/stories" className="lead__link">
              {data.history.title}
            </Link>
          </Card>
        </div>
      </section>

      <section className="place main-section page__section">
        <div
          className="card-container card-container_type_main-article"
          key={data.place.id}
        >
          <CardPlace
            isChosen={data.place.chosen}
            title={data.place.title}
            name={data.place.name}
            imageUrl={data.place.imageUrl}
            link={data.place.link}
            color="yellow"
            sectionClass="card-place_main"
          />
          <CardAnnotation
            info={data.place.info}
            description={data.place.description}
            isMain
          />
        </div>
      </section>

      <section
        className="articles main-section page__section"
        key={data.articles[0].id}
      >
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            color={data.articles[0].color}
            title={data.articles[0].title}
          />
        </Link>
      </section>

      <section className="movies main-section page__section cards-grid cards-grid_content_small-cards">
        {data.movies.map((item) => (
          <Link to="/films" className="main-section__link card-pagination_page_main" key={item.id}>
            <CardFilm
              imageUrl={item.imageUrl}
              title={item.title}
              info={item.info}
              link={item.link}
              tags={item.tags}
            />
          </Link>
        ))}
      </section>

      <section className="video main-section page__section">
        <Link
          to="/video"
          key={data.video.id}
          className="main-section__link"
        >
          <CardVideoMain
            title={data.video.title}
            info={data.video.info}
            link={data.video.link}
            imageUrl={data.video.imageUrl}
            duration={data.video.duration}
          />
        </Link>
      </section>

      <section className="main-questions main-section page__section">
        <div className="card-container card-container_type_iframe">
          <Widget
            title="Facebook"
            link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs=timeline&width=630&height=630&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
          />
          <div className="main-questions__container">
            {data.questions.map((item) => (
              <Link
                to="/questions"
                className="main-section__link main-section__link_el_question"
                key={item.id}
              >
                <CardQuestion title={item.title} tags={item.tags} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="articles main-section page__section"
        key={data.articles[1].id}
      >
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            color={data.articles[1].color}
            title={data.articles[1].title}
          />
        </Link>
      </section>
    </>
  );
}

MainPage.propTypes = {
  isAuthorized: PropTypes.bool
};

MainPage.defaultProps = {
  isAuthorized: false
};

export default MainPage;
