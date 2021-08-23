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
import { QUESTIONS_URL, STORIES_URL, ARTICLES_URL } from '../../config/routes';
import { staticImageUrl } from '../../config/config';
import { ERROR_MESSAGES } from '../../config/constants';
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
  CardAnimatedPlug,
  AnimatedPageContainer,
} from './index';

// количество отображаемых карточек с фильмами и вопросами
const MOVIES_COUNT = 4;
const QUESTIONS_COUNT = 3;

const { headTitle, headDescription, CardAnimatedPlugText } = mainPageTexts;

function MainPage() {
  useScrollToTop();

  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupAboutEvent } = useContext(PopupsContext);

  const [mainPageData, setMainPageData] = useState(null);
  const [isCityChanging, setIsCityChanging] = useState(false);
  const [isPageError, setIsPageError] = useState(false);
  const activityTypes = useActivityTypes();

  // запись/отписка на мероприятия
  const { handleEventBooking, selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setMainPageData({ ...mainPageData, event: selectedEvent });
    }
  }, [selectedEvent]);

  // запрос даты главной страницы при загрузке и при смене города
  function getMainPageDataOnLoad() {
    getMainPageData()
      .then((data) => setMainPageData(data))
      .catch(() => setIsPageError(true))
      .finally(() => setIsCityChanging(false));
  }

  useEffect(() => {
    if (currentUser) {
      setIsCityChanging(true);
    }
    getMainPageDataOnLoad();
  }, [currentUser?.city]);

  // глобальный лоадер (без футера)
  if (!mainPageData && !isPageError) {
    return <Loader isCentered />;
  }

  function renderEventsBlock() {
    // карточка ивента
    if (currentUser && mainPageData?.event) {
      return (
        <CardCalendar
          sectionClass="scale-in"
          key={mainPageData.event?.id}
          cardData={mainPageData.event}
          onEventSignUpClick={handleEventBooking}
          onEventDescriptionClick={openPopupAboutEvent}
        />
      );
    }

    // красно-зеленая заглушка
    return <CardStub sectionClass="scale-in" />;
  }

  function renderHistoryBlock() {
    if (mainPageData?.history) {
      return (
        <Card
          sectionClass="lead__media scale-in"
          key={mainPageData?.history?.id}
        >
          <Link to={STORIES_URL} className="lead__link">
            {mainPageData?.history?.title}
          </Link>
          <img
            src={`${staticImageUrl}/${mainPageData?.history?.image}`}
            alt={mainPageData.history.title}
            className="lead__media-img"
          />
        </Card>
      );
    }

    return (
      <CardAnimatedPlug
        text={CardAnimatedPlugText}
        sectionClass="lead__media scale-in"
      />
    );
  }

  function renderPlaceSection() {
    return (
      <section className="place main-section page__section">
        <CardPlace
          key={mainPageData?.place?.id}
          data={mainPageData?.place}
          sectionClass="card-container_type_main-article scale-in"
          activityTypes={activityTypes}
          isBig
          isMainPage
        />
      </section>
    );
  }

  function renderArticleSection(article, color) {
    return (
      <section className="articles main-section page__section scale-in">
        <CardArticleBig
          key={article?.id}
          title={article?.title}
          color={color}
          articleUrl={article?.articleUrl}
          pageUrl={ARTICLES_URL}
        />
      </section>
    );
  }

  function renderMoviesSection() {
    // рандомизируем массив
    const randomMovies = randomizeArray(mainPageData?.movies, MOVIES_COUNT);

    const additionalMoviesClasses =
      randomMovies.length > 1
        ? `movies_pagination movies_pagination_${randomMovies.length} scale-in`
        : '';
    // возвращаем
    return (
      <section className="movies main-section page__section cards-grid cards-grid_content_small-cards">
        {randomMovies.map((movie) => (
          <CardFilm
            data={movie}
            key={movie.id}
            sectionClass={additionalMoviesClasses}
          />
        ))}
      </section>
    );
  }

  function renderVideoSection() {
    return (
      <section className="video main-section page__section scale-in">
        <CardVideoMain
          key={mainPageData?.video?.id}
          data={mainPageData?.video}
        />
      </section>
    );
  }

  function renderQuestionBlock() {
    const randomQuestions = randomizeArray(
      mainPageData?.questions,
      QUESTIONS_COUNT
    );

    return (
      <div className="main-questions__container">
        {randomQuestions.map((item) => (
          <Link
            to={QUESTIONS_URL}
            className={`main-section__link scale-in main-section__link_el_question ${
              randomQuestions.length > 2 ? ' main-questions_pagination' : ''
            }`}
            key={item?.id}
          >
            <CardQuestion data={item} />
          </Link>
        ))}
      </div>
    );
  }

  function renderPageContent() {
    return (
      <>
        {/* секция из ивента + истории */}
        <section className="lead page__section">
          <div className="card-container card-container_type_identical">
            {/* ивент */}
            {isCityChanging ? <Loader isNested /> : renderEventsBlock()}

            {/* история дружбы */}
            {renderHistoryBlock()}
          </div>
        </section>

        {/* секция Виджет + Вопросы */}
        <section className="main-questions main-section page__section fade-in">
          <div className="card-container card-container_type_iframe">
            <Widget
              title="Facebook"
              link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBigBrothers.BigSisters.Russia&tabs=timeline&width=420&height=627&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
            />

            {/* секция Вопросов */}
            {mainPageData?.questions?.length > 0 && renderQuestionBlock()}
          </div>
        </section>

        {/* секция Место */}
        {mainPageData?.place && renderPlaceSection()}

        {/* секция Статья */}
        {mainPageData?.articles?.length > 0 &&
          renderArticleSection(mainPageData?.articles[0], 'blue')}

        {/* секция Фильмы */}
        {mainPageData?.movies && renderMoviesSection()}

        {/* секция Видео */}
        {mainPageData?.video && renderVideoSection()}

        {/* секция Статья */}
        {mainPageData?.articles?.length > 1 &&
          renderArticleSection(mainPageData?.articles[1], 'green')}
      </>
    );
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {isPageError ? (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      ) : (
        renderPageContent()
      )}
    </BasePage>
  );
}

export default MainPage;
