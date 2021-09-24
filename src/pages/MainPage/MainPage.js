import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import mainPageTexts from './locales/RU';
import { CurrentUserContext, PopupsContext } from '../../contexts';
import { useActivityTypes, useEventBooking } from '../../hooks';
import { QUESTIONS_URL, STORIES_URL } from '../../config/routes';
import { staticImageUrl } from '../../config/config';
import { ERROR_MESSAGES } from '../../config/constants';
import { randomizeArray } from '../../utils/utils';
import getMainPageData from '../../api/main-page';
import {
  AnimatedPageContainer,
  BasePage,
  Card,
  CardAnimatedPlug,
  CardArticleBig,
  CardCalendar,
  CardFilm,
  CardPlace,
  CardQuestion,
  CardStub,
  CardVideoMain,
  Loader,
  Widget,
} from './index';
import './MainPage.scss';

// количество отображаемых карточек с фильмами и вопросами
const MOVIES_COUNT = 4;
const QUESTIONS_COUNT = 3;

const { headTitle, headDescription, CardAnimatedPlugText } = mainPageTexts;

function MainPage() {
  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupAboutEvent } = useContext(PopupsContext);

  const [mainPageData, setMainPageData] = useState(null);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [isCityChanging, setIsCityChanging] = useState(false);
  const [isPageError, setIsPageError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const activityTypes = useActivityTypes();

  // запись/отписка на мероприятия
  const { handleEventBooking, selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setMainPageData((prevData) => ({ ...prevData, event: selectedEvent }));
    }
  }, [selectedEvent]);

  // запрос даты главной страницы при загрузке и при смене города
  const getMainPageDataOnLoad = () => {
    getMainPageData()
      .then((data) => setMainPageData(data))
      .catch(() => setIsPageError(true))
      .finally(() => setIsCityChanging(false));
  };

  useEffect(() => {
    if (currentUser) {
      setIsCityChanging(true);
    }
    getMainPageDataOnLoad();
  }, [currentUser?.city]);

  // рандомизируем вопросы и фильмы 1 раз при загрузке страницы
  useEffect(() => {
    if (mainPageData && isPageLoading) {
      setRandomQuestions(
        randomizeArray(mainPageData.questions, QUESTIONS_COUNT)
      );
      setRandomMovies(randomizeArray(mainPageData.movies, MOVIES_COUNT));
      setIsPageLoading(false);
    }
  }, [mainPageData]);

  // глобальный лоадер (без футера)
  if (!mainPageData && !isPageError) {
    return <Loader isCentered />;
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
          <Link
            to={`${STORIES_URL}/${mainPageData?.history?.id}`}
            className="lead__link"
          >
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
        />
      </section>
    );
  }

  function renderMoviesSection() {
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
    return (
      <div className="main-questions__container">
        {randomQuestions.map((item) => (
          <CardQuestion
            key={item?.id}
            data={item}
            href={{
              pathname: QUESTIONS_URL,
              state: { fromMainPage: true, question: item },
            }}
            sectionClass={`main-section__question scale-in ${
              randomQuestions.length > 2 ? ' main-questions_pagination' : ''
            }`}
          />
        ))}
      </div>
    );
  }

  function renderPageContent() {
    return (
      <>
        <section className="lead page__section">
          <div className="card-container card-container_type_identical">
            {isCityChanging ? <Loader isNested /> : renderEventsBlock()}
            {renderHistoryBlock()}
          </div>
        </section>

        <section className="main-questions main-section page__section fade-in">
          <div className="card-container card-container_type_iframe">
            <Widget
              title="Facebook"
              link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBigBrothers.BigSisters.Russia&tabs=timeline&width=420&height=627&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
            />
            {randomQuestions?.length > 0 && renderQuestionBlock()}
          </div>
        </section>

        {mainPageData?.place && renderPlaceSection()}

        {mainPageData?.articles?.length > 0 &&
          renderArticleSection(mainPageData?.articles[0], 'blue')}

        {randomMovies?.length > 0 && renderMoviesSection()}

        {mainPageData?.video && renderVideoSection()}

        {mainPageData?.articles?.length > 1 &&
          renderArticleSection(mainPageData?.articles[1], 'green')}
      </>
    );
  }
}

export default MainPage;
