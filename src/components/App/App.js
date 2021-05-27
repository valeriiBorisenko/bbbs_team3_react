import React, { useState, useEffect } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
// попапы
import PopupConfirmation from '../Popup/PopupConfirmation';
import PopupSuccessfully from '../Popup/PopupSuccessfully';
import PopupLogin from '../Popup/PopupLogin';
import PopupAboutEvent from '../Popup/PopupAboutEvent';
import PopupCities from '../PopupCities/PopupCities';

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

  // выбранная карточка (дата)
  const [selectedCalendarCard, setSelectedCalendarCard] = useState('');
  // записан ли
  const [isBooked, setIsBooked] = useState(false);

  function handleClickBooked() {
    setIsBooked(true);
  }

  // управление попапами
  function closeAllPopups() {
    setIsPopupConfirmationOpen(false);
    setIsPopupSuccessfullyOpen(false);
    setIsPopupLoginOpen(false);
    setIsPopupAboutDescriptionOpen(false);
    setIsPopupCitiesOpen(false);
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

  useEffect(() => {
    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="page">
        <Header
          isAuthorized={isAuthorized}
          handleUserButtonClick={handleUserButtonClick}
          handleChangeCity={handleClickPopupCities}
        />
        <Main
          isAuthorized={isAuthorized}
          isBooked={isBooked}
          openConfirmationPopup={handleClickPopupConfirmationOpened}
          openAboutEventPopup={handleClickPopupAboutEventOpened}
        />
        <Footer />
        <PopupConfirmation
          isOpen={isPopupConfirmationOpen}
          onClose={closeAllPopups}
          onConfirmButtonClick={handleClickPopupSuccessfullyOpened}
          data={selectedCalendarCard}
          putBookedEvent={handleClickBooked}
        />
        <PopupSuccessfully
          isOpen={isPopupSuccessfullyOpen}
          onClose={closeAllPopups}
          data={selectedCalendarCard}
        />
        <PopupLogin
          isOpen={isPopupLoginOpen}
          onClose={closeAllPopups}
          onLoginFormSubmit={handleClickPopupLoginOpened}
        />
        <PopupAboutEvent
          isOpen={isPopupAboutDescriptionOpen}
          onClose={closeAllPopups}
          onEventSignUpClick={handleClickPopupSuccessfullyOpened}
          data={selectedCalendarCard}
        />
        <PopupCities isOpen={isPopupCitiesOpen} onClose={closeAllPopups} />
      </div>
    </BrowserRouter>
  );
}

export default App;
