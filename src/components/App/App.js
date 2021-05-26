import React, { useState } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import PopupCities from '../PopupCities/PopupCities';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const handleUserButtonClick = () => {
    if (isAuthorized) setIsAuthorized(false);
    else setIsAuthorized(true);
  };

  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);

  function handleClickPopupCities() {
    setIsPopupCitiesOpen(true);
  }

  function closeAllPopups() {
    // setIsPopupConfirmationOpen(false);
    // setIsPopupSuccessfullyOpen(false);
    // setIsPopupLoginOpen(false);
    setIsPopupCitiesOpen(false);
  }

  return (
    <BrowserRouter>
      <div className="page">
        <Header
          isAuthorized={isAuthorized}
          handleUserButtonClick={handleUserButtonClick}
          handleChangeCity={handleClickPopupCities}
        />
        <Main isAuthorized={isAuthorized} />
        <Footer />
        <PopupCities isOpen={isPopupCitiesOpen} onClose={closeAllPopups} />
      </div>
    </BrowserRouter>
  );
}

export default App;
