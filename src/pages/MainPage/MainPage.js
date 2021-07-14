import './MainPage.scss';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import mainPageTexts from '../../locales/main-page-RU';
import { CurrentUserContext, PopupsContext } from '../../contexts/index';
import {
  useScrollToTop,
  useEventBooking,
  useActivityTypes,
} from '../../hooks/index';
import {
  QUESTIONS_URL,
  STORIES_URL,
  VIDEO_URL,
  MOVIES_URL,
} from '../../config/routes';
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
  Rubric,
} from './index';

// количество отображаемых карточек с фильмами и вопросами
const MOVIES_COUNT = 4;
const QUESTIONS_COUNT = 3;

const { headTitle, headDescription } = mainPageTexts;

function MainPage() {
  useScrollToTop();

  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupAboutEvent } = useContext(PopupsContext);

  const [mainPageData, setMainPageData] = useState(null);
  const [isCityChanging, setIsCityChanging] = useState(false);
  const activityTypes = useActivityTypes();

  // запись/отписка на мероприятия
  const { handleEventBooking, selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setMainPageData({ ...mainPageData, event: selectedEvent });
    }
  }, [selectedEvent]);

  // запрос даты главной страницы при загрузке и при смене города
  //! из-за этого главная 2 раза запрашивается для юзера!!
  useEffect(() => {
    if (currentUser) {
      setIsCityChanging(true);
      getMainPageData()
        .then((data) => setMainPageData(data))
        .catch((error) => console.log(error))
        .finally(() => setIsCityChanging(false));
    }
  }, [currentUser?.city]);

  useEffect(() => {
    getMainPageData()
      .then((data) => setMainPageData(data))
      .catch((error) => console.log(error));
  }, []);

  // глобальный лоадер (без футера)
  if (!mainPageData) {
    return <Loader isCentered />;
  }

  function renderEventsBlock() {
    // карточка ивента
    if (currentUser && mainPageData?.event) {
      return (
        <CardCalendar
          key={mainPageData.event.id}
          cardData={mainPageData.event}
          onEventSignUpClick={handleEventBooking}
          onEventDescriptionClick={openPopupAboutEvent}
        />
      );
    }

    // красно-зеленая заглушка
    return <CardStub />;
  }

  function renderHistoryBlock() {
    if (mainPageData?.history) {
      return (
        <Card sectionClass="lead__media" key={mainPageData.history.id}>
          <img
            src={`${staticImageUrl}/${mainPageData.history.image}`}
            alt={mainPageData.history.title}
            className="card__media-img"
          />
          <Link to={STORIES_URL} className="lead__link">
            {mainPageData.history.title}
          </Link>
        </Card>
      );
    }

    // return <Card sectionClass="lead__media" />
    return null;
  }

  function renderPlaceSection() {
    return (
      <section className="place main-section page__section fade-in">
        <CardPlace
          key={mainPageData.place.id}
          data={mainPageData.place}
          sectionClass="card-container_type_main-article"
          activityTypes={activityTypes}
          isBig
          isMainPage
        />
      </section>
    );
  }

  function renderArticleSection(article) {
    return (
      <section className="articles main-section page__section fade-in">
        <Link to="/articles" className="main-section__link">
          <CardArticleBig key={article.id} title={article.title} color="blue" />
        </Link>
      </section>
    );
  }

  function renderMoviesSection() {
    // рандомизируем массив
    const randomMovies = randomizeArray(mainPageData.movies, MOVIES_COUNT);

    const additionalMoviesClasses =
      randomMovies.length > 1
        ? `movies_pagination movies_pagination_${randomMovies.length}`
        : '';
    const className = `main-section__link ${additionalMoviesClasses}`;
    // возвращаем
    return (
      <section className="movies main-section page__section cards-grid cards-grid_content_small-cards fade-in">
        {randomMovies.map((movie) => (
          <Link to={MOVIES_URL} className={className} key={movie.id}>
            <CardFilm data={movie}>
              <ul className="card-film__rubric-list">
                {movie.tags.map((tag) => (
                  <li key={tag.id}>
                    <Rubric title={tag.name} sectionClass="card-film__rubric" />
                  </li>
                ))}
              </ul>
            </CardFilm>
          </Link>
        ))}
      </section>
    );
  }

  function renderVideoSection() {
    return (
      <section className="video main-section page__section fade-in">
        <Link to={VIDEO_URL} className="main-section__link">
          <CardVideoMain
            key={mainPageData.video.id}
            data={mainPageData.video}
          />
        </Link>
      </section>
    );
  }

  function renderQuestionBlock() {
    const randomQuestions = randomizeArray(
      mainPageData.questions,
      QUESTIONS_COUNT
    );

    return (
      <div className="main-questions__container">
        {randomQuestions.map((item) => (
          <Link
            to={QUESTIONS_URL}
            className={`main-section__link main-section__link_el_question ${
              randomQuestions.length > 2 ? ' main-questions_pagination' : ''
            }`}
            key={item.id}
          >
            <CardQuestion data={item} />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {/* секция из ивента + истории */}
      <section className="lead page__section fade-in">
        <div className="card-container card-container_type_identical">
          {/* ивент */}
          {isCityChanging ? <Loader isNested /> : renderEventsBlock()}

          {/* история дружбы */}
          {renderHistoryBlock()}
          {/* //! вернуть АНИМАЦИЮ если истории нет! */}
        </div>
      </section>

      {/* секция Место */}
      {mainPageData?.place ? renderPlaceSection() : null}

      {/* секция Статья */}
      {mainPageData?.articles?.length > 0
        ? renderArticleSection(mainPageData?.articles[0])
        : null}

      {/* секция Фильмы */}
      {mainPageData?.movies ? renderMoviesSection() : null}

      {/* секция Видео */}
      {mainPageData?.video ? renderVideoSection() : null}

      {/* секция Виджет + Вопросы */}
      <section className="main-questions main-section page__section fade-in">
        <div className="card-container card-container_type_iframe">
          {/* виджету нужна заглушка на случай если не загрузится или его обрезал ADblock */}
          {/* //! Виджет опять полетел! */}
          <Widget
            title="Facebook"
            link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBigBrothers.BigSisters.Russia&tabs=timeline&width=420&height=627&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
          />

          {/* секция Вопросов */}
          {mainPageData?.questions?.length > 0 ? renderQuestionBlock() : null}
        </div>
      </section>

      {/* секция Статья */}
      {mainPageData?.articles?.length > 1
        ? renderArticleSection(mainPageData?.articles[1])
        : null}
    </BasePage>
  );
}

export default MainPage;
