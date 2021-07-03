import './MainPage.scss';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CurrentUserContext, PopupsContext } from '../../contexts/index';
import { useScrollToTop, useEventBooking } from '../../hooks/index';
import { QUESTIONS_URL } from '../../config/routes';
import { staticImageUrl } from '../../config/config';
import { randomizeArray } from '../../utils/utils';
import getMainPageData from '../../api/main-page';
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

function MainPage() {
  useScrollToTop();

  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupAboutEvent } = useContext(PopupsContext);

  const [mainPageData, setMainPageData] = useState(null);
  const randomMovies = randomizeArray(mainPageData?.movies, MOVIES_COUNT);
  const randomQuestions = randomizeArray(
    mainPageData?.questions,
    QUESTIONS_COUNT
  );

  const { handleEventBooking, selectedEvent } = useEventBooking();

  // запрос даты главной страницы при загрузке и при смене города
  useEffect(() => {
    getMainPageData()
      .then(setMainPageData)
      .catch((error) => console.log(error));
  }, [currentUser?.city]);

  // глобальный лоадер (без футера)
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
              cardData={selectedEvent || mainPageData?.event}
              onEventSignUpClick={handleEventBooking}
              onEventDescriptionClick={openPopupAboutEvent}
            />
          ) : (
            <CardStub />
          )}
          <Card sectionClass="lead__media" key={mainPageData?.history?.id}>
            <img
              src={`${staticImageUrl}/${mainPageData?.history?.image}`}
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
          isBig
          isMainPage
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
        {randomMovies.map((item) => (
          <Link
            to="/films"
            className={`main-section__link ${
              randomMovies.length > 1
                ? `movies_pagination movies_pagination_${randomMovies.length}`
                : ''
            }`}
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
            {randomQuestions.map((item) => (
              <Link
                to={QUESTIONS_URL}
                className={`main-section__link main-section__link_el_question ${
                  randomQuestions.length > 2 ? ' main-questions_pagination' : ''
                }`}
                key={item?.id}
              >
                <CardQuestion data={item} />
              </Link>
            ))}
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

export default MainPage;
