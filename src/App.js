import React, { useState, useEffect } from 'react';
import './App.scss';
import { useHistory } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Router from './navigation/Router';
import Loader from './components/utils/Loader/Loader';
import { PROFILE_URL } from './config/routes';
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
import { CurrentUserContext, CitiesContext } from './contexts/index';
// API
// import AuthApi from './utils/auth';
import {
  makeEventRegistration,
  cancelEventRegistration,
} from './api/event-participants';
// хуки
import { useCities, useAuth } from './hooks/index';
import {
  setRegisterOnEvent,
  cancelRegisterOnEvent,
} from './hooks/useSubscriptionEvents';

function App() {
  const history = useHistory();

  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] =
    useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);

  // управление попапами (открыть/закрыть)
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupLoginOpen(false);
    setIsPopupAboutDescriptionOpen(false);
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

  function handleClickPopupAboutEventOpened() {
    setIsPopupAboutDescriptionOpen(true);
  }

  function handleClickPopupCities() {
    setIsPopupCitiesOpen(true);
  }

  function closePopupCities() {
    setIsPopupCitiesOpen(false);
  }

  function handleClickPopupErrorOpened() {
    setIsPopupErrorOpen(true);
  }

  // текущий юзер/контекст
  const [currentUser, setCurrentUser] = useState(null);
  const { isCheckingToken, handleLogout, handleLogin, checkToken } = useAuth(
    setCurrentUser,
    closeAllPopups
  );

  // список городов/контекст
  const cities = useCities();

  function registerOnEvent(card) {
    makeEventRegistration({ event: card.id })
      .then(() => setRegisterOnEvent())
      .then(() => handleClickPopupSuccessfullyOpened())
      .catch(console.log);
  }

  function cancelRegistration(card) {
    cancelEventRegistration(card.id)
      .then(() => cancelRegisterOnEvent())
      .then(() => setIsPopupAboutDescriptionOpen(false))
      .catch(console.log);
  }

  function handleEventBooking(card) {
    if (card.booked) {
      // мы записаны на ивент, надо отписаться
      cancelRegistration(card);
    } else {
      // мы НЕ записаны на ивент
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
      <CitiesContext.Provider value={cities}>
        <CurrentUserContext.Provider value={currentUser}>
          <div className="page">
            <Header
              onLogout={handleLogout}
              onUserButtonClick={handleUserButtonClick}
              onCityChange={handleClickPopupCities}
            />
            {!isCheckingToken ? (
              <Router handlers={handlers} />
            ) : (
              <Loader isCentered />
            )}
            <PopupConfirmation
              isOpen={isPopupConfirmationOpen}
              onClose={closeAllPopups}
              onConfirmButtonClick={registerOnEvent}
              onErrorClick={handleClickPopupErrorOpened}
            />
            <PopupSuccessfully
              isOpen={isPopupSuccessfullyOpen}
              onClose={closeAllPopups}
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
            />
            <PopupCities
              isOpen={isPopupCitiesOpen}
              onClose={closePopupCities}
              onSubmit={setCurrentUser}
            />
            <PopupError isOpen={isPopupErrorOpen} onClose={closeAllPopups} />
          </div>
        </CurrentUserContext.Provider>
      </CitiesContext.Provider>
    </HelmetProvider>
  );
}

export default App;
