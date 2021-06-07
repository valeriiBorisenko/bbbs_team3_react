import React, { useState, useEffect } from 'react';
import './App.scss';
import { Route, Switch, useHistory } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Loader from '../ui/Loader/Loader';
// попапы
import PopupConfirmation from '../Popups/PopupConfirmation/PopupConfirmation';
import PopupSuccessfully from '../Popups/PopupSuccessfully/PopupSuccessfully';
import PopupLogin from '../Popups/PopupLogin/PopupLogin';
import PopupAboutEvent from '../Popups/PopupAboutEvent/PopupAboutEvent';
import PopupCities from '../Popups/PopupCities/PopupCities';
import PopupError from '../Popups/PopupError/PopupError';
// страницы
import MainPage from '../Routes/MainPage/MainPage';
import Calendar from '../Routes/Calendar/Calendar';
import AboutUs from '../Routes/AboutUs/AboutUs';
import Account from '../Routes/Account/Account';
import PageNotFound from '../Routes/PageNotFound/PageNotFound';
import QuestionsPage from '../Routes/QuestionsPage/QuestionsPage';
import WhereToGo from '../Routes/WhereToGo/WhereToGo';
// логины, авторизация
import ProtectedRoute from '../Routes/ProtectedRoute/ProtectedRoute';
import CurrentUserContext from '../../contexts/CurrentUserContext';
// API
import AuthApi from '../../utils/auth';
import Api from '../../utils/api';

function App() {
  const history = useHistory();
  // текущий юзер
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  // список городов
  const [cities, setCities] = useState(null);
  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);
  // выбранная карточка при открытии попапа (календарь)
  // в объекте всегда только те поля что пришли с сервера
  const [selectedCalendarCard, setSelectedCalendarCard] = useState({});
  // данные страниц с сервера
  const [dataCalendar, setDataCalendar] = useState([]);
  const [dataMain, setDataMain] = useState(null);

  // загрузка данных страниц
  // загрузка данных главной страницы с сервера
  useEffect(() => {
    Api.getMainPageData()
      .then((res) => setDataMain(res.mainPageData))
      .catch((err) => console.log(err));
  }, []);

  // загрузка данных страницы календаря, если ты залогиненный
  useEffect(() => {
    if (currentUser) {
      Api.getCalendarPageData()
        .then((res) => setDataCalendar(res.calendarPageData))
        .catch((err) => {
          setIsPopupErrorOpen(true);
          console.log(err);
        });
    } else {
      setDataCalendar([]);
    }
  }, [currentUser]);

  // управление попапами (открыть/закрыть)
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupLoginOpen(false);
    setIsPopupAboutDescriptionOpen(false);
    setIsPopupCitiesOpen(false);
    setIsPopupErrorOpen(false);
  }

  function handleClickPopupConfirmationOpened() {
    setIsPopupConfirmationOpen(true);
  }

  function handleClickPopupSuccessfullyOpened() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(true);
  }

  function handleClickPopupLoginOpened() {
    setIsPopupLoginOpen(true);
  }

  function handleClickPopupAboutEventOpened(cardData) {
    // запоминаем карточку
    setSelectedCalendarCard(cardData);
    // открываем попап подтвердить
    setIsPopupAboutDescriptionOpen(true);
  }

  function handleClickPopupCities() {
    setIsPopupCitiesOpen(true);
  }

  function handleClickPopupErrorOpened() {
    setIsPopupErrorOpen(true);
  }

  //! api
  function handleLogin({ login, password }) {
    AuthApi.authorize(login, password)
      .then((data) => {
        const { access, refresh } = data.token;
        if (refresh && access) {
          AuthApi.setAuth(access);
          localStorage.setItem('jwt', access);
          Promise.all([
            AuthApi.getUserData(),
            Api.getCalendarPageData()
            // в дальнейшем сама страница календаря будет запрашивать АПИ напрямую
          ])
            .then(([userData, events]) => {
              setDataCalendar(events.calendarPageData);
              setCurrentUser(userData.userData);
            })
            .then(() => closeAllPopups())
            .catch((error) => console.log(error)); // при получении данных произошла ошибка
        }
      })
      .catch((error) => console.log(error)); // авторизация (работа с сервером) закончилась ошибкой
  }

  function handleLogout() {
    AuthApi.clearAuth();
    setCurrentUser(null);
    localStorage.removeItem('jwt');
    history.push('/');
  }

  // проверка токена между сессиями
  function checkToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      AuthApi.getUserData()
        .then((data) => setCurrentUser(data.userData))
        .then(() => setIsCheckingToken(false))
        .catch((error) => console.log(error)); // при получении userData возникла проблема
    } else {
      setIsCheckingToken(false);
    }
  }

  // работает с запросом Api (booked)
  function updateEvent(cardData) {
    return Api.updateEvent(cardData)
      .then((updatedCardData) => {
        setDataCalendar(
          dataCalendar
            .map((eventObj) => (eventObj.id === updatedCardData.id ? updatedCardData : eventObj))
        );
      });
  }

  function handleEventUpdate(cardData) {
    updateEvent(cardData)
      .then(() => handleClickPopupSuccessfullyOpened())
      .catch(() => handleClickPopupErrorOpened());
  }

  function bookingHandler(cardData, isBooked) {
    if (isBooked) {
      updateEvent(cardData)
        .then(() => setIsPopupAboutDescriptionOpen(false))
        .catch(() => handleClickPopupErrorOpened());
    } else {
      setSelectedCalendarCard(cardData);
      setIsPopupAboutDescriptionOpen(false);
      handleClickPopupConfirmationOpened();
    }
  }

  function handleUserButtonClick() {
    if (currentUser) {
      history.push('/account');
    } else {
      handleClickPopupLoginOpened();
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  // получение списка городов
  useEffect(() => {
    Api.getCities()
      .then((res) => setCities(res.cities))
      .catch((error) => console.log(error));
  }, []);

  // эффект закрытия модалок по Escape
  useEffect(() => {
    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    });
  }, []);

  return (
    <HelmetProvider>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header
            onLogout={handleLogout}
            onUserButtonClick={handleUserButtonClick}
            onCityChange={handleClickPopupCities}
            cities={cities}
          />
          <main className="main">
            {!isCheckingToken ? (
              <Switch>
                <Route exact path="/">
                  <MainPage
                    onEventSignUpClick={bookingHandler}
                    onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
                    dataMain={dataMain}
                  />
                </Route>
                <Route exact path="/about-us">
                  <AboutUs />
                </Route>
                <Route path="/afisha">
                  <Calendar
                    onEventSignUpClick={bookingHandler}
                    onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
                    onOpenLoginPopup={handleClickPopupLoginOpened}
                    dataCalendar={dataCalendar}
                  />
                </Route>
                <Route path="/questions">
                  <QuestionsPage />
                </Route>
                <ProtectedRoute
                  exact
                  path="/account"
                  component={Account}
                  onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
                  eventsData={dataCalendar}
                  isAuth={!!currentUser}
                />
                <Route exact path="/where-to-go">
                  <WhereToGo
                    onRecommendPlace
                    openPopupCities
                    unauthСity
                    isPlacePopupOpened
                  />
                </Route>
                <Route path="*">
                  <PageNotFound />
                </Route>
              </Switch>
            ) : <Loader />}
          </main>
          <Footer />
          <PopupConfirmation
            isOpen={isPopupConfirmationOpen}
            onClose={closeAllPopups}
            onConfirmButtonClick={handleEventUpdate}
            onErrorClick={handleClickPopupErrorOpened}
            cardData={selectedCalendarCard}
          />
          <PopupSuccessfully
            isOpen={isPopupSuccessfullyOpen}
            onClose={closeAllPopups}
            cardData={selectedCalendarCard}
          />
          <PopupLogin
            isOpen={isPopupLoginOpen}
            onClose={closeAllPopups}
            onLoginFormSubmit={handleLogin}
          />
          <PopupAboutEvent
            isOpen={isPopupAboutDescriptionOpen}
            onClose={closeAllPopups}
            onEventSignUpClick={bookingHandler}
            onErrorClick={handleClickPopupErrorOpened}
            cardData={selectedCalendarCard}
          />
          <PopupCities
            cities={cities}
            isOpen={isPopupCitiesOpen}
            onClose={closeAllPopups}
            onSubmit={setCurrentUser}
          />
          <PopupError
            isOpen={isPopupErrorOpen}
            onClose={closeAllPopups}
          />
        </div>
      </CurrentUserContext.Provider>
    </HelmetProvider>
  );
}

export default App;
