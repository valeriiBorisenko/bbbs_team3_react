import React, { useState, useEffect } from 'react';
import './App.scss';
import { useHistory } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Router from './navigation/Router';
import Loader from './components/utils/Loader/Loader';
import { MAIN_PAGE_URL, PROFILE_URL } from './config/routes';
// попапы
import {
  PopupConfirmation,
  PopupSuccessfully,
  PopupLogin,
  PopupAboutEvent,
  PopupCities,
  PopupError,
} from './components/Popups/index';
// логины, авторизация
import CurrentUserContext from './contexts/CurrentUserContext';
// API
import AuthApi from './utils/auth';
import Api from './utils/api';

function App() {
  const history = useHistory();

  // текущий юзер
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // список городов
  const [cities, setCities] = useState(null); //! вынести в хук

  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);

  // выбранная карточка при открытии попапа (календарь)
  const [selectedCalendarCard, setSelectedCalendarCard] = useState({});

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
  function handleLogin(loginData) {
    AuthApi.authorize(loginData)
      .then((token) => {
        const { access, refresh } = token;
        if (refresh && access) {
          AuthApi.setAuth(access);
          localStorage.setItem('jwt', access);
          AuthApi.getUserData()
            .then((userData) => setCurrentUser(userData))
            .then(() => closeAllPopups())
            .catch((error) => console.log(error)); // при получении данных юзера произошла ошибка
        }
      })
      .catch((error) => console.log(error)); // авторизация (работа с сервером) закончилась ошибкой
  }

  function handleLogout() {
    AuthApi.clearAuth();
    setCurrentUser(null);
    localStorage.removeItem('jwt');
    history.push(MAIN_PAGE_URL);
  }

  // проверка токена между сессиями
  function checkToken() {
    const token = localStorage.getItem('jwt');
    if (token) {
      AuthApi.setAuth(token);
      AuthApi.getUserData()
        .then((userData) => setCurrentUser(userData))
        .then(() => setIsCheckingToken(false))
        .catch((error) => console.log(error)); // при получении userData возникла проблема
    } else {
      setIsCheckingToken(false);
    }
  }

  // работает с запросом Api (booked)
  function registerOnEvent(cardData, cardId) {
    Api.registerOnEvent({ event: cardId })
      .then(() => handleClickPopupSuccessfullyOpened())
      .then(() => setSelectedCalendarCard(cardData))
      // .then(() => {
      //   cardData.booked = true;
      // })
      .catch((error) => console.log(error));
  }

  // function cancelEventRegistration() {
  // }

  function handleEventBooking(cardData, cardId, isEventBooked) {
    console.log('bookingHandler');
    console.log(cardData);
    console.log(cardId);
    console.log(isEventBooked);
    // console.log(cardData.id);
    // console.log(isEventBooked);
    if (isEventBooked) {
      console.log('мы не записаны');
      // мы записаны на ивент, надо отписаться
    } else {
      console.log('мы не записаны');
      // мы НЕ записаны на ивент, надо открыть попап "подтвердите"
      setSelectedCalendarCard(cardData); // отмечаем карточку
      setIsPopupAboutDescriptionOpen(false); // закрываем попап подробно
      handleClickPopupConfirmationOpened(); // открываем попап "подтвердите"
    }
  }

  function handleUserButtonClick() {
    if (currentUser) {
      history.push(PROFILE_URL);
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
      .then((citiesList) => setCities(citiesList))
      .catch((error) => console.log(error));
  }, []); //! перенести в хук

  // эффект закрытия модалок по Escape
  useEffect(() => {
    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    });
  }, []);

  const handlers = {
    handleEventBooking,
    handleClickPopupAboutEventOpened,
    handleClickPopupLoginOpened,
    handleClickPopupCities,
  };

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
          {!isCheckingToken ? <Router handlers={handlers} /> : <Loader isCentered />}
          <PopupConfirmation
            isOpen={isPopupConfirmationOpen}
            onClose={closeAllPopups}
            onConfirmButtonClick={registerOnEvent}
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
            onEventSignUpClick={handleEventBooking}
            onErrorClick={handleClickPopupErrorOpened}
            cardData={selectedCalendarCard}
          />
          <PopupCities
            cities={cities}
            isOpen={isPopupCitiesOpen}
            onClose={closeAllPopups}
            onSubmit={setCurrentUser}
          />
          <PopupError isOpen={isPopupErrorOpen} onClose={closeAllPopups} />
        </div>
      </CurrentUserContext.Provider>
    </HelmetProvider>
  );
}

export default App;
