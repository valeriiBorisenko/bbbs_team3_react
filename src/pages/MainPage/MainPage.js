import './MainPage.scss';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import {
  BasePage,
  Loader,
  Card,
  CardStub,
  CardCalendar,
  CardPlace,
  CardArticleBig,
  CardFilm,
  CardVideoMain,
  Widget,
  CardQuestion
} from './index';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import { QuestionsUrl } from '../../config/routes';

function MainPage({
  onEventSignUpClick,
  onEventFullDescriptionClick,
  dataMain,
  handlers
}) {
  useSmoothScrollOnWindow({ top: 0 });
  const currentUser = useContext(CurrentUserContext);

  function eventSignUpHandler(cardData) {
    onEventSignUpClick(cardData, cardData.booked);
  }

  if (!dataMain) {
    return <Loader />;
  }

  return (
    <BasePage handlers={handlers}>
      <Helmet>
        <title>наставники.про</title>
        <meta
          name="description"
          content="Наставники.про – цифровая информационная платформа организации «Старшие Братья Старшие Сестры». Созданная для поддержки наставников программы."
        />
      </Helmet>
      <section className="lead page__section fade-in">
        <div className="card-container card-container_type_identical">
          {currentUser ? (
            <CardCalendar
              key={dataMain.event.id}
              cardData={dataMain.event}
              onEventSignUpClick={eventSignUpHandler}
              onEventFullDescriptionClick={onEventFullDescriptionClick}
            />
          ) : (
            <CardStub />
          )}
          <Card sectionClass="lead__media" key={dataMain.history.id}>
            <img
              src={dataMain.history.imageUrl}
              alt={dataMain.history.title}
              className="card__media-img"
            />
            <Link to="/stories" className="lead__link">
              {dataMain.history.title}
            </Link>
          </Card>
        </div>
      </section>

      <section className="place main-section page__section fade-in">
        <CardPlace
          key={dataMain.place.id}
          data={dataMain.place}
          sectionClass="card-container_type_main-article"
          isMain
        />
      </section>

      <section className="articles main-section page__section fade-in">
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            key={dataMain.articles[0].id}
            data={dataMain.articles[0]}
          />
        </Link>
      </section>

      <section className="movies main-section page__section cards-grid cards-grid_content_small-cards fade-in">
        {dataMain.movies.map((item) => (
          <Link
            to="/films"
            className="main-section__link card-pagination_page_main"
            key={item.id}
          >
            <CardFilm data={item} />
          </Link>
        ))}
      </section>

      <section className="video main-section page__section fade-in">
        <Link to="/video" className="main-section__link">
          <CardVideoMain key={dataMain.video.id} data={dataMain.video} />
        </Link>
      </section>

      <section className="main-questions main-section page__section fade-in">
        <div className="card-container card-container_type_iframe">
          <Widget
            title="Facebook"
            link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBigBrothers.BigSisters.Russia&tabs=timeline&width=420&height=627&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
          />
          <div className="main-questions__container">
            {dataMain.questions.map((item) => (
              <Link
                to={`${QuestionsUrl}`}
                className="main-section__link main-section__link_el_question"
                key={item.id}
              >
                <CardQuestion data={item} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="articles main-section page__section fade-in">
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            key={dataMain.articles[1].id}
            data={dataMain.articles[1]}
          />
        </Link>
      </section>
    </BasePage>
  );
}

MainPage.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  dataMain: PropTypes.objectOf(PropTypes.any),
  handlers: PropTypes.objectOf(PropTypes.any)
};

MainPage.defaultProps = {
  onEventSignUpClick: () => {},
  onEventFullDescriptionClick: () => {},
  dataMain: {},
  handlers: {}
};

export default MainPage;
