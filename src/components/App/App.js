import React, { useState, useEffect } from 'react';
import './App.scss';
import { Route, Switch, useHistory } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
// попапы
import PopupConfirmation from '../PopupConfirmation/PopupConfirmation';
import PopupSuccessfully from '../PopupSuccessfully/PopupSuccessfully';
import PopupLogin from '../PopupLogin/PopupLogin';
import PopupAboutEvent from '../PopupAboutEvent/PopupAboutEvent';
import PopupCities from '../PopupCities/PopupCities';
import PopupError from '../PopupError/PopupError';
// страницы
import MainPage from '../MainPage/MainPage';
import Calendar from '../Calendar/Calendar';
import AboutUs from '../AboutUs/AboutUs';
import Account from '../Account/Account';
import PageNotFound from '../PageNotFound/PageNotFound';
// логины, авторизация
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
// работа с API
import { getCalendarPageData, postUserDataOnLogin, getMainPageData } from '../../utils/api';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  // console.log(setIsAuthorized);
  const history = useHistory();
  // console.log(postUserDataOnLogin);

  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);
  const [isLoding, setIsLoding] = useState(true);

  // выбранная карточка при открытии попапа
  const [selectedCalendarCard, setSelectedCalendarCard] = useState({});

  // данные страниц с сервера
  const [dataCalendar, setDataCalendar] = useState([]); //! переименовать в eventsArray
  const [dataMain, setDataMain] = useState(null);

  // загрузка данных главной страницы с сервера
  useEffect(() => {
    getMainPageData()
      .then((res) => setDataMain(res.data.mainPageData))
      .then(() => setIsLoding(false))
      .catch((err) => console.log(err));
  }, [setDataMain]);

  // управление попапами
  function closeAllPopups() {
    // console.log('tyt');
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupLoginOpen(false);
    setIsPopupAboutDescriptionOpen(false);
    setIsPopupCitiesOpen(false);
    setIsPopupErrorOpen(false);
  }

  function handleClickPopupConfirmationOpened(cardData) {
    setIsPopupConfirmationOpen(true);
    setSelectedCalendarCard(cardData);
  }

  function handleClickPopupSuccessfullyOpened() {
    closeAllPopups();
    setIsPopupSuccessfullyOpen(true);
  }

  function handleClickPopupLoginOpened() {
    setIsPopupLoginOpen(true);
  }

  function handleUserButtonClick() {
    if (isAuthorized) {
      history.push('/account');
    } else {
      handleClickPopupLoginOpened();
    }
  }

  //!
  function handleLogin({ login, password }) {
    // console.log(login);
    // console.log(password);
    postUserDataOnLogin(login, password).then((data) => {
      const { access, refresh } = data.token;
      if (refresh && access) {
        localStorage.setItem('jwt', access);
        //! вместо одного вызова АПИ должно быть Promise.all и вызовы:
        // инфаЮзера + списокИвентов
        getCalendarPageData().then((response) => {
          setDataCalendar(response.calendarPageData);
          setIsAuthorized(true);
          closeAllPopups();
        });
      }
    }).catch((error) => console.log(error));
  }

  function handleClickPopupAboutEventOpened(cardData) {
    setIsPopupAboutDescriptionOpen(true);
    setSelectedCalendarCard(cardData);
  }

  function handleClickPopupCities() {
    setIsPopupCitiesOpen(true);
  }

  function handleClickPopupErrorOpened() {
    setIsPopupErrorOpen(true);
  }

  // эффект закрытия модалок по Escape
  useEffect(() => {
    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    });
  }, []);

  // эффект при монтировании, загрузка данных страницы Календарь с сервера
  // useEffect(() => {
  //   getCalendarPageData()
  //     .then((res) => setDataCalendar(res.data.calendarPageData))
  //     .then(() => setIsLoding(false))
  //     .catch((err) => {
  //       setIsPopupErrorOpen(true);
  //       console.log(err);
  //     });
  // }, [setDataCalendar]);

  return (
    <div className="page">
      <Header
        isAuthorized={isAuthorized}
        handleUserButtonClick={handleUserButtonClick}
        handleChangeCity={handleClickPopupCities}
      />
      <main className="main">
        <Switch>
          <Route exact path="/">
            <MainPage
              isAuthorized={isAuthorized}
              onEventSignUpClick={handleClickPopupConfirmationOpened}
              onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
              dataMain={dataMain}
            />
          </Route>
          <Route exact path="/about-us">
            <AboutUs isAuthorized={isAuthorized} />
          </Route>
          <Route path="/calendar">
            <Calendar
              isAuthorized={isAuthorized}
              onEventSignUpClick={handleClickPopupConfirmationOpened}
              onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
              onOpenLoginPopup={handleClickPopupLoginOpened}
              dataCalendar={dataCalendar}
              isLoding={isLoding}
            />
          </Route>
          <ProtectedRoute
            path="/"
            component={Account}
            isAuthorized={isAuthorized}
          />
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
      </main>
      <Footer />
      <PopupConfirmation
        isOpen={isPopupConfirmationOpen}
        onClose={closeAllPopups}
        onConfirmButtonClick={handleClickPopupSuccessfullyOpened}
        onErrorClick={handleClickPopupErrorOpened}
        data={selectedCalendarCard}
      />
      <PopupSuccessfully
        isOpen={isPopupSuccessfullyOpen}
        onClose={closeAllPopups}
        data={selectedCalendarCard}
      />
      <PopupLogin
        isOpen={isPopupLoginOpen}
        onClose={closeAllPopups}
        onLoginFormSubmit={handleLogin}
      />
      <PopupAboutEvent
        isOpen={isPopupAboutDescriptionOpen}
        onClose={closeAllPopups}
        onEventSignUpClick={handleClickPopupSuccessfullyOpened}
        onErrorClick={handleClickPopupErrorOpened}
        data={selectedCalendarCard}
      />
      <PopupCities
        isOpen={isPopupCitiesOpen}
        onClose={closeAllPopups}
      />
      <PopupError
        isOpen={isPopupErrorOpen}
        onClose={closeAllPopups}
      />
    </div>
  );
}

export default App;
