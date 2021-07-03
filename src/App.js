import React, { useState, useEffect } from 'react';
import './App.scss';
import { HelmetProvider } from 'react-helmet-async';
import Router from './navigation/Router';
import Loader from './components/utils/Loader/Loader';
// попапы
import {
  PopupConfirmation,
  PopupSuccessfully,
  PopupAboutEvent,
  PopupError,
} from './components/Popups/index';
// логины, авторизация
import { CurrentUserContext, CitiesContext } from './contexts/index';
// API
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
  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] =
    useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);

  // управление попапами (открыть/закрыть)
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
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

  function handleClickPopupAboutEventOpened() {
    setIsPopupAboutDescriptionOpen(true);
  }

  function handleClickPopupErrorOpened() {
    setIsPopupErrorOpen(true);
  }

  // текущий юзер/контекст
  const [currentUser, setCurrentUser] = useState(null);
  const updateUser = (data) => {
    setCurrentUser(data);
  };

  const { isCheckingToken, checkToken } = useAuth(updateUser);

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
  };

  return (
    <HelmetProvider>
      <CitiesContext.Provider value={cities}>
        <CurrentUserContext.Provider value={{ currentUser, updateUser }}>
          <div className="page">
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
            <PopupAboutEvent
              isOpen={isPopupAboutDescriptionOpen}
              onClose={closeAllPopups}
              onEventSignUpClick={handleEventBooking}
              onErrorClick={handleClickPopupErrorOpened}
            />
            <PopupError isOpen={isPopupErrorOpen} onClose={closeAllPopups} />
          </div>
        </CurrentUserContext.Provider>
      </CitiesContext.Provider>
    </HelmetProvider>
  );
}

export default App;
