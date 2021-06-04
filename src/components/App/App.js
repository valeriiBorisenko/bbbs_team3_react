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
import {
  getCalendarPageData, postUserDataOnLogin, getMainPageData, setAuth, updateEventFetch
} from '../../utils/api';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const history = useHistory();

  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);
  const [isLoding, setIsLoding] = useState(true);

  // выбранная карточка при открытии попапа
  // selectedCalendarCard содержит только те поля что пришли с сервера
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

  // загрузка данных страницы календаря, если ты залогиненный
  useEffect(() => {
    if (isAuthorized) {
      getCalendarPageData()
        .then((res) => setDataCalendar(res.calendarPageData))
        .then(() => setIsLoding(false))
        .catch((err) => {
          setIsPopupErrorOpen(true);
          console.log(err);
        });
    } else {
      setDataCalendar([]);
    }
  }, [setDataCalendar, isAuthorized]);

  // управление попапами
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

  // работает с запросом Api
  function updateEvent(cardData) {
    return updateEventFetch(cardData).then((updatedCardData) => {
      setDataCalendar(
        // eslint-disable-next-line max-len
        dataCalendar.map((eventObj) => (eventObj.id === updatedCardData.id ? updatedCardData : eventObj))
      );
    });
  }

  function handleEventUpdate(cardData) {
    // вызываем апи + при успехе показываем попап "успешно"
    updateEvent(cardData).then(() => handleClickPopupSuccessfullyOpened());
  }

  function bookingHandler(cardData, isBooked) {
    if (isBooked) {
      // сразу вызываем апи, если все ок - закрываем попап "подробно"
      // идем на сервер и патчим ивент (меняем на booked=false)
      // закрываем модалку (по желанию)
      updateEvent(cardData).then(() => setIsPopupAboutDescriptionOpen(false));
    } else {
      // запоминаем карточку
      setSelectedCalendarCard(cardData);
      // закрываем попап с подробностями карточки
      setIsPopupAboutDescriptionOpen(false);
      // открываем попап подтвердить
      handleClickPopupConfirmationOpened();
    }
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

  //! api
  function handleLogin({ login, password }) {
    // console.log(login);
    // console.log(password);
    postUserDataOnLogin(login, password).then((data) => {
      const { access, refresh } = data.token;
      if (refresh && access) {
        setAuth(access); //! не работает пока
        localStorage.setItem('jwt', access);
        //! вместо одного вызова АПИ должно быть Promise.all и вызовы:
        // инфаЮзера + списокИвентов
        // getCalendarPageData().then((response) => {
        // setDataCalendar(response.calendarPageData);
        // });
        setIsAuthorized(true);
        closeAllPopups();
      }
    });
  }

  function handleLogout() {
    setIsAuthorized(false); //! либо очистка объекта контекста юзера в дальнейшем
    localStorage.removeItem('jwt');
    history.push('/');
  }

  //! кривая замена проверки токена между сессиями =(
  function checkToken() {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит валидность токена
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      // проверим токен
      setIsAuthorized(true);
    }
  }
  //! проверка токена при монтировании
  useEffect(() => {
    checkToken();
  }, []);

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

  // эффект закрытия модалок по Escape
  useEffect(() => {
    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    });
  }, []);

  return (
    <div className="page">
      <Header
        isAuthorized={isAuthorized}
        onLogout={handleLogout}
        onUserButtonClick={handleUserButtonClick}
        onCityChange={handleClickPopupCities}
      />
      <main className="main">
        <Switch>
          <Route exact path="/">
            <MainPage
              isAuthorized={isAuthorized}
              onEventSignUpClick={bookingHandler}
              onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
              dataMain={dataMain}
            />
          </Route>
          <Route exact path="/about-us">
            <AboutUs isAuthorized={isAuthorized} />
          </Route>
          <Route path="/afisha">
            <Calendar
              isAuthorized={isAuthorized}
              onEventSignUpClick={bookingHandler}
              onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
              onOpenLoginPopup={handleClickPopupLoginOpened}
              dataCalendar={dataCalendar}
              isLoding={isLoding}
            />
          </Route>
          <ProtectedRoute
            path="/"
            component={Account}
            onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
            eventsData={dataCalendar}
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
