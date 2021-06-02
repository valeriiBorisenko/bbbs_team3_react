import React, { useState, useEffect } from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../Header/Header';
// import Main from '../Main/Main';
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
// серверная дата
import { getCalendarPageData } from '../../utils/api';
import PopupConfirmDeleteDiary from '../PopupConfirmDeleteDiary/PopupConfirmDeleteDiary';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const handleUserButtonClick = () => {
    if (isAuthorized) setIsAuthorized(false);
    else setIsAuthorized(true);
  };

  // стейт переменные попапов
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupSuccessfullyOpen, setIsPopupSuccessfullyOpen] = useState(false);
  const [isPopupAboutDescriptionOpen, setIsPopupAboutDescriptionOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupErrorOpen, setIsPopupErrorOpen] = useState(false);
  const [isPopupConfirmDeleteDiaryOpen, setIsPopupConfirmDeleteDiaryOpen] = useState(false);
  const [isLoding, setIsLoding] = useState(true);

  // выбранная карточка при открытии попапа
  const [selectedCalendarCard, setSelectedCalendarCard] = useState({});

  // данные страницы-календаря с сервера
  const [dataCalendar, setDataCalendar] = useState([]);

  // выбранная карточка дневника при открытии попапа подтверждения
  const [selectedDiaryCard, setSelectedDiaryCard] = useState({});

  // управление попапами
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupLoginOpen(false);
    setIsPopupAboutDescriptionOpen(false);
    setIsPopupCitiesOpen(false);
    setIsPopupErrorOpen(false);
    setIsPopupConfirmDeleteDiaryOpen(false);
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

  function handleClickPopupConfirmDeleteDiary(cardData) {
    setIsPopupConfirmDeleteDiaryOpen(true);
    setSelectedDiaryCard(cardData);
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
  useEffect(() => {
    getCalendarPageData()
      .then((res) => setDataCalendar(res.data.calendarPageData))
      .then(() => setIsLoding(false))
      .catch((err) => {
        setIsPopupErrorOpen(true);
        console.log(err);
      });
  }, [setDataCalendar]);

  return (
    <BrowserRouter>
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
              />
            </Route>
            <Route exact path="/about-us">
              <AboutUs isAuthorized={isAuthorized} />
            </Route>
            <Route path="/account">
              <Account onDiaryDelete={handleClickPopupConfirmDeleteDiary} />
            </Route>
            <Route path="/calendar">
              <Calendar
                isAuthorized={isAuthorized}
                onEventSignUpClick={handleClickPopupConfirmationOpened}
                onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
                onLoginFormSubmit={handleClickPopupLoginOpened}
                dataCalendar={dataCalendar}
                isLoding={isLoding}
              />
            </Route>
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
        <PopupConfirmDeleteDiary
          isOpen={isPopupConfirmDeleteDiaryOpen}
          onClose={closeAllPopups}
          data={selectedDiaryCard}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
