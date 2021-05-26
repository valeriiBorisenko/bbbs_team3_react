import './Main.scss';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import MainPage from '../MainPage/MainPage';
import AboutUs from '../AboutUs/AboutUs';
import Account from '../Account/Account';
import PageNotFound from '../PageNotFound/PageNotFound';
import Calendar from '../Calendar/Calendar';
import PopupConfirmation from '../Popup/PopupConfirmation';
import PopupSuccessfully from '../Popup/PopupSuccessfully';

function Main({ isAuthorized }) {
  const [isSelected, setIsSelected] = useState(false);
  const [isPopupConfirmation, setIsPopupConfirmation] = useState(false);
  const [isPopupSuccessfully, setIsPopupSuccessfully] = useState(false);

  function handleClickSelectedButton() {
    setIsSelected(true);
  }

  function handleClickPopupConfirmationOpened() {
    setIsPopupConfirmation(true);
  }

  function handleClickPopupSuccessfullyOpened() {
    setIsPopupSuccessfully(true);
  }

  function closeAllPopups() {
    setIsPopupConfirmation(false);
    setIsPopupSuccessfully(false);
  }

  useEffect(() => {
    const clickOverlay = (evt) => {
      if (evt.target.classList.contains('popup_opened')) {
        closeAllPopups();
      }
    };
    const clickEscape = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };
    if (isPopupConfirmation) {
      window.addEventListener('click', clickOverlay);
      window.addEventListener('keyup', clickEscape);
    }
    return () => {
      window.removeEventListener('click', clickOverlay);
      window.removeEventListener('keyup', clickEscape);
    };
  }, [isPopupConfirmation]);

  return (
    <main className="main">
      <Switch>
        <Route exact path="/">
          <MainPage isAuthorized={isAuthorized} />
        </Route>
        <Route exact path="/about-us">
          <AboutUs isAuthorized={isAuthorized} />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/calendar">
          <Calendar
            isAuthorized={isAuthorized}
            onClick={handleClickPopupConfirmationOpened}
            clickButton={handleClickSelectedButton}
            isSelected={isSelected}
          />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
      <PopupConfirmation
        isOpen={isPopupConfirmation}
        onClose={closeAllPopups}
        onClick={handleClickPopupSuccessfullyOpened}
      />
      <PopupSuccessfully
        isOpen={isPopupSuccessfully}
        onClose={closeAllPopups}
      />
    </main>
  );
}

Main.propTypes = {
  isAuthorized: PropTypes.bool
};

Main.defaultProps = {
  isAuthorized: false
};

export default Main;
