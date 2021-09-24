import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Router from './navigation/Router';
import Loader from './components/utils/Loader/Loader';
// попапы
import {
  PopupAboutEvent,
  PopupArticle,
  PopupBook,
  PopupCities,
  PopupConfirmation,
  PopupError,
  PopupLogin,
  PopupPlace,
  PopupRecommendSuccess,
  PopupSuccessfully,
  PopupVideo,
} from './components/Popups';
// логины, авторизация
import {
  CitiesContext,
  CurrentUserContext,
  ErrorsContext,
  PopupsContext,
} from './contexts';
// хуки
import { useAuth, useCities } from './hooks';

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
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [isBookPopupOpen, setIsBookPopupOpen] = useState(false);
  const [isPlacePopupOpen, setIsPlacePopupOpen] = useState(false);
  const [isArticlePopupOpen, setIsArticlePopupOpen] = useState(false);

  const [isWithoutRegister, setIsWithoutRegister] = useState(false);

  // управление попапами (открыть/закрыть)
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupAboutDescriptionOpen(false);
    setIsPopupRecommendSuccessOpen(false);
    setIsVideoPopupOpen(false);
    setIsBookPopupOpen(false);
    setIsPlacePopupOpen(false);
    setIsArticlePopupOpen(false);
  }

  function openPopupConfirmation() {
    setIsPopupConfirmationOpen(true);
  }

  function openPopupSuccessfully() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(true);
  }

  function openPopupAboutEvent(withoutRegister) {
    if (withoutRegister) {
      setIsWithoutRegister(true);
    } else {
      setIsWithoutRegister(false);
    }
    setIsPopupAboutDescriptionOpen(true);
  }

  function openPopupError() {
    setIsPopupErrorOpen(true);
  }

  function closePopupError() {
    setIsPopupErrorOpen(false);
  }

  function openPopupCities() {
    setIsPopupCitiesOpen(true);
  }

  function closePopupCities() {
    setIsPopupCitiesOpen(false);
  }

  function openPopupLogin() {
    setIsPopupLoginOpen(true);
  }

  function closePopupLogin() {
    setIsPopupLoginOpen(false);
  }

  function openPopupRecommendSuccess() {
    setIsPopupRecommendSuccessOpen(true);
  }

  function openPopupVideo() {
    setIsVideoPopupOpen(true);
  }

  function openPopupBook() {
    setIsBookPopupOpen(true);
  }

  function openPopupPlace() {
    setIsPlacePopupOpen(true);
  }

  function openPopupArticle() {
    setIsArticlePopupOpen(true);
  }

  // контекст попапов
  const popupsContextValue = {
    closeAllPopups,
    closePopupLogin,
    openPopupConfirmation,
    openPopupSuccessfully,
    openPopupAboutEvent,
    openPopupError,
    openPopupCities,
    openPopupLogin,
    openPopupRecommendSuccess,
    openPopupVideo,
    openPopupBook,
    openPopupPlace,
    openPopupArticle,
  };

  // текущий юзер/контекст
  const [currentUser, setCurrentUser] = useState(null);
  const updateUser = (value) => setCurrentUser(value);

  const currentUserContextValue = useMemo(
    () => ({ currentUser, updateUser }),
    [currentUser]
  );

  // список городов/контекст
  const { cities, defaultCity } = useCities();

  const citiesContextValue = useMemo(
    () => ({ cities, defaultCity }),
    [cities, defaultCity]
  );

  // серверные ошибки/контекст
  const [serverError, setServerError] = useState(null);
  const setError = (value) => setServerError(value);
  const clearError = () => setServerError(null);

  const errorsContextValue = useMemo(
    () => ({ serverError, setError, clearError }),
    [serverError]
  );

  const { isCheckingToken, checkToken } = useAuth(updateUser);

  useEffect(() => {
    checkToken();
  }, []);

  // закрытие всех попапов при смене страницы, очистка ошибок
  useEffect(() => {
    closeAllPopups();
    closePopupError();
    closePopupCities();
    clearError();
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
      <CitiesContext.Provider value={citiesContextValue}>
        <CurrentUserContext.Provider value={currentUserContextValue}>
          <ErrorsContext.Provider value={errorsContextValue}>
            <PopupsContext.Provider value={popupsContextValue}>
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
                  isWithoutRegister={isWithoutRegister}
                  isOpen={isPopupAboutDescriptionOpen}
                  onClose={closeAllPopups}
                />
                <PopupLogin
                  isOpen={isPopupLoginOpen}
                  onClose={closePopupLogin}
                />
                <PopupCities
                  isOpen={isPopupCitiesOpen}
                  onClose={closePopupCities}
                />
                <PopupError
                  isOpen={isPopupErrorOpen}
                  onClose={closePopupError}
                />
                <PopupRecommendSuccess
                  isOpen={isPopupRecommendSuccessOpen}
                  onClose={closeAllPopups}
                />
                <PopupVideo
                  isOpen={isVideoPopupOpen}
                  onClose={closeAllPopups}
                />
                <PopupBook isOpen={isBookPopupOpen} onClose={closeAllPopups} />
                <PopupPlace
                  isOpen={isPlacePopupOpen}
                  onClose={closeAllPopups}
                />
                <PopupArticle
                  isOpen={isArticlePopupOpen}
                  onClose={closeAllPopups}
                />
              </div>
            </PopupsContext.Provider>
          </ErrorsContext.Provider>
        </CurrentUserContext.Provider>
      </CitiesContext.Provider>
    </HelmetProvider>
  );
}

export default App;
