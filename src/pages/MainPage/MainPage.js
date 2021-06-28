import './MainPage.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useScrollToTop } from '../../hooks/index';
import { QUESTIONS_URL } from '../../config/routes';
import { adminUrl } from '../../config/config';
import { randomizeArray } from '../../utils/utils';
import Api from '../../utils/api';
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
  CardQuestion,
} from './index';

// количество отображаемых карточек с фильмами и вопросами
const MOVIES_COUNT = 4;
const QUESTIONS_COUNT = 3;

function MainPage({ onEventSignUpClick, onEventFullDescriptionClick }) {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);
  const [mainPageData, setMainPageData] = useState(null);

  const getMainPageData = () => {
    Api.getMainPageData().then(setMainPageData).catch(console.log); // попап ошибка!
  };

  // запрос даты главной страницы, если сменили город
  useEffect(() => {
    getMainPageData();
  }, [currentUser?.city]);

  // запрос даты главной страницы
  useEffect(() => {
    getMainPageData();
  }, []);

  if (!mainPageData) {
    return <Loader isCentered />;
  }

  return (
    <BasePage>
      <Helmet>
        <title>наставники.про</title>
        <meta
          name="description"
          content="Наставники.про – цифровая информационная платформа организации «Старшие Братья Старшие Сестры». Созданная для поддержки наставников программы."
        />
      </Helmet>
      <section className="lead page__section fade-in">
        <div className="card-container card-container_type_identical">
          {currentUser && mainPageData?.event ? (
            <CardCalendar
              key={mainPageData?.event?.id}
              cardData={mainPageData?.event}
              onEventSignUpClick={onEventSignUpClick}
              onEventFullDescriptionClick={onEventFullDescriptionClick}
            />
          ) : (
            <CardStub />
          )}
          <Card sectionClass="lead__media" key={mainPageData?.history?.id}>
            <img
              src={`${adminUrl}/media/${mainPageData?.history?.image}`}
              alt={mainPageData?.history?.title}
              className="card__media-img"
            />
            <Link to="/stories" className="lead__link">
              {mainPageData?.history?.title}
            </Link>
          </Card>
        </div>
      </section>

      <section className="place main-section page__section fade-in">
        <CardPlace
          key={mainPageData?.place?.id}
          data={mainPageData?.place}
          sectionClass="card-container_type_main-article"
          isMain
        />
      </section>

      {mainPageData?.articles.length > 0 && (
        <section className="articles main-section page__section fade-in">
          <Link to="/articles" className="main-section__link">
            <CardArticleBig
              key={mainPageData?.articles[0]?.id}
              title={mainPageData?.articles[0]?.title}
              color="blue"
            />
          </Link>
        </section>
      )}

      <section className="movies main-section page__section cards-grid cards-grid_content_small-cards fade-in">
        {randomizeArray(mainPageData?.movies, MOVIES_COUNT).map((item) => (
          <Link
            to="/films"
            className="main-section__link card-pagination_page_main"
            key={item?.id}
          >
            <CardFilm data={item} />
          </Link>
        ))}
      </section>

      <section className="video main-section page__section fade-in">
        <Link to="/video" className="main-section__link">
          <CardVideoMain
            key={mainPageData?.video?.id}
            data={mainPageData?.video}
          />
        </Link>
      </section>

      <section className="main-questions main-section page__section fade-in">
        <div className="card-container card-container_type_iframe">
          <Widget
            title="Facebook"
            link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBigBrothers.BigSisters.Russia&tabs=timeline&width=420&height=627&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
          />
          <div className="main-questions__container">
            {randomizeArray(mainPageData?.questions, QUESTIONS_COUNT).map(
              (item) => (
                <Link
                  to={QUESTIONS_URL}
                  className={`main-section__link ${
                    QUESTIONS_COUNT > 2
                      ? 'main-section__link_el_question main-section__link_el_question_pagination'
                      : 'main-section__link_el_question'
                  }`}
                  key={item?.id}
                >
                  <CardQuestion data={item} />
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {mainPageData?.articles.length > 1 && (
        <section className="articles main-section page__section fade-in">
          <Link to="/articles" className="main-section__link">
            <CardArticleBig
              key={mainPageData?.articles[1]?.id}
              title={mainPageData?.articles[1]?.title}
              color="green"
            />
          </Link>
        </section>
      )}
    </BasePage>
  );
}

MainPage.propTypes = {
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
};

MainPage.defaultProps = {
  onEventSignUpClick: () => {},
  onEventFullDescriptionClick: () => {},
};

export default MainPage;
