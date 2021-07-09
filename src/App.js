import React, { useState, useEffect } from 'react';
import './App.scss';
import { HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Router from './navigation/Router';
import Loader from './components/utils/Loader/Loader';
// попапы
import {
  PopupConfirmation,
  PopupSuccessfully,
  PopupAboutEvent,
  PopupError,
  PopupCities,
  PopupLogin,
  PopupRecommendSuccess,
} from './components/Popups/index';
// логины, авторизация
import {
  CurrentUserContext,
  CitiesContext,
  PopupsContext,
} from './contexts/index';
// хуки
import { useCities, useAuth } from './hooks/index';

function App() {
  const { pathname } = useLocation();

  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] =
    useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupRecommendSuccessOpen, setIsPopupRecommendSuccessOpen] =
    useState(false);

  // управление попапами (открыть/закрыть)
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupAboutDescriptionOpen(false);
    setIsPopupErrorOpen(false);
    setIsPopupLoginOpen(false);
    setIsPopupCitiesOpen(false);
    setIsPopupRecommendSuccessOpen(false);
  }

  function openPopupConfirmation() {
    setIsPopupConfirmationOpen(true);
  }

  function openPopupSuccessfully() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(true);
  }

  function openPopupAboutEvent() {
    setIsPopupAboutDescriptionOpen(true);
  }

  function openPopupError() {
    setIsPopupErrorOpen(true);
  }

  function openPopupCities() {
    setIsPopupCitiesOpen(true);
  }

  function openPopupLogin() {
    setIsPopupLoginOpen(true);
  }

  function openPopupRecommendSuccess() {
    setIsPopupRecommendSuccessOpen(true);
  }

  // текущий юзер/контекст
  const [currentUser, setCurrentUser] = useState(null);
  const updateUser = (value) => setCurrentUser(value);

  const { isCheckingToken, checkToken } = useAuth(updateUser);

  // список городов/контекст
  const cities = useCities();

  useEffect(() => {
    checkToken();
  }, []);

  // закрытие всех попапов при смене страницы
  useEffect(() => {
    closeAllPopups();
  }, [pathname]);

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
      <CitiesContext.Provider value={cities}>
        <CurrentUserContext.Provider value={{ currentUser, updateUser }}>
          <PopupsContext.Provider
            value={{
              closeAllPopups,
              openPopupConfirmation,
              openPopupSuccessfully,
              openPopupAboutEvent,
              openPopupError,
              openPopupCities,
              openPopupLogin,
              openPopupRecommendSuccess,
            }}
          >
            <div className="page">
              {!isCheckingToken ? <Router /> : <Loader isCentered />}
              <PopupConfirmation
                isOpen={isPopupConfirmationOpen}
                onClose={closeAllPopups}
              />
              <PopupSuccessfully
                isOpen={isPopupSuccessfullyOpen}
                onClose={closeAllPopups}
              />
              <PopupAboutEvent
                isOpen={isPopupAboutDescriptionOpen}
                onClose={closeAllPopups}
              />
              <PopupLogin isOpen={isPopupLoginOpen} onClose={closeAllPopups} />
              <PopupCities
                isOpen={isPopupCitiesOpen}
                onClose={closeAllPopups}
              />
              <PopupError isOpen={isPopupErrorOpen} onClose={closeAllPopups} />
              <PopupRecommendSuccess
                isOpen={isPopupRecommendSuccessOpen}
                onClose={closeAllPopups}
              />
            </div>
          </PopupsContext.Provider>
        </CurrentUserContext.Provider>
      </CitiesContext.Provider>
    </HelmetProvider>
  );
}

export default App;
