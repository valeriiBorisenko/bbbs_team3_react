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
// import PopupConfirmDeleteDiary from '../PopupConfirmDeleteDiary/PopupConfirmDeleteDiary';
// страницы
import MainPage from '../MainPage/MainPage';
import Calendar from '../Calendar/Calendar';
import AboutUs from '../AboutUs/AboutUs';
import Account from '../Account/Account';
import PageNotFound from '../PageNotFound/PageNotFound';
// логины, авторизация
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import CurrentUserContext from '../../contexts/CurrentUserContext';
// работа с API
import {
  getCalendarPageData,
  authorize,
  getMainPageData,
  setAuth,
  updateEventFetch,
  clearAuth,
  getUserData
} from '../../utils/api';

function App() {
  const history = useHistory();

  //! текущий юзер
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  console.log(currentUser);

  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);
  // const [isPopupConfirmDeleteDiaryOpen, setIsPopupConfirmDeleteDiaryOpen] = useState(false);
  const [isLoding, setIsLoding] = useState(true);

  // выбранная карточка при открытии попапа (календарь)
  // selectedCalendarCard содержит только те поля что пришли с сервера
  const [selectedCalendarCard, setSelectedCalendarCard] = useState({});
  // выбранная карточка дневника при открытии попапа подтверждения
  // const [selectedDiaryCard, setSelectedDiaryCard] = useState({});

  // данные страниц с сервера (пока вынуждены тут оставить их)
  const [dataCalendar, setDataCalendar] = useState([]);
  const [dataMain, setDataMain] = useState(null);

  // загрузка данных страниц
  // загрузка данных главной страницы с сервера
  useEffect(() => {
    getMainPageData()
      .then((res) => setDataMain(res.data.mainPageData))
      .then(() => setIsLoding(false))
      .catch((err) => console.log(err));
  }, [setDataMain]);

  // загрузка данных страницы календаря, если ты залогиненный
  useEffect(() => {
    //! заменить на "пользователь из контекста !null"
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

  // управление попапами (открыть/закрыть)
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupLoginOpen(false);
    setIsPopupAboutDescriptionOpen(false);
    setIsPopupCitiesOpen(false);
    setIsPopupErrorOpen(false);
    // setIsPopupConfirmDeleteDiaryOpen(false);
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

  // function handleClickPopupConfirmDeleteDiary(cardData) {
  //   setIsPopupConfirmDeleteDiaryOpen(true);
  //   setSelectedDiaryCard(cardData);
  // }

  //! api
  function handleLogin({ login, password }) {
    authorize(login, password)
      .then((data) => {
        const { access, refresh } = data.token;
        // если токен получен верно
        if (refresh && access) {
          // устанавливаем заголовки
          setAuth(access); //! работает, но бесполезно пока
          // сохраняем токен
          // localStorage.setItem('jwt', access); //! временно отменил запоминание юзера

          // делаем запрос на календарь-дату и профиль юзера
          Promise.all([
            getUserData(),
            getCalendarPageData()
            // в дальнейшем сама страница календаря будет запрашивать АПИ напрямую
          ])
            .then(([userData, events]) => {
              // проверка
              console.log(events.calendarPageData);
              console.log(userData.userData);

              //! устанавливаем эти данные в стейты
              // стейт данных календаря
              setDataCalendar(events.calendarPageData);

              // стейт данных профиля
              setCurrentUser(userData.userData);
              //! заменить на наполнение переменной контекста юзера из userData
              setIsAuthorized(true);
            })
            .then(() => closeAllPopups())
            .catch((error) => console.log(error)); // при получении данных произошла ошибка
          // closeAllPopups(); //! засунуть в then
        }
      })
      .catch((error) => console.log(error)); // авторизация (работа с сервером) закончилась ошибкой
  }

  function handleLogout() {
    clearAuth();
    setIsAuthorized(false);
    //! заменить за очистку переменной контекста юзера
    localStorage.removeItem('jwt');
    history.push('/');
  }

  // проверка токена между сессиями
  // как только будет нормальный сервер будем проверять иначе
  function checkToken() {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит валидность токена
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      // проверим токен
      setIsAuthorized(true);
      //! заменить за запрос юзера и заполнение контекста
    }
  }

  //! работает с запросом Api (booked)
  function updateEvent(cardData) {
    return updateEventFetch(cardData).then((updatedCardData) => {
      setDataCalendar(
        dataCalendar
          .map((eventObj) => (eventObj.id === updatedCardData.id ? updatedCardData : eventObj))
      );
    });
  }

  function handleEventUpdate(cardData) {
    // вызываем апи + при успехе показываем попап "успешно"
    updateEvent(cardData)
      .then(() => handleClickPopupSuccessfullyOpened())
      .catch(() => handleClickPopupErrorOpened());
  }

  function bookingHandler(cardData, isBooked) {
    if (isBooked) {
      // сразу вызываем апи, если все ок - закрываем попап "подробно"
      // идем на сервер и патчим ивент (меняем на booked=false)
      // закрываем модалку (по желанию)
      updateEvent(cardData)
        .then(() => setIsPopupAboutDescriptionOpen(false))
        .catch(() => handleClickPopupErrorOpened());
    } else {
      // запоминаем карточку
      setSelectedCalendarCard(cardData);
      // закрываем попап с подробностями карточки
      setIsPopupAboutDescriptionOpen(false);
      // открываем попап подтвердить
      handleClickPopupConfirmationOpened();
    }
  }

  // в теории можно вынести в хедер вместе с хуком истории
  function handleUserButtonClick() {
    if (isAuthorized) {
      history.push('/account');
    } else {
      handleClickPopupLoginOpened();
    }
  }

  //! проверка токена при монтировании
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
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
    </CurrentUserContext.Provider>
  );
}

export default App;
