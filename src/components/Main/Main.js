import './Main.scss';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getCalendarPageData } from '../../utils/api';
// страницы
import MainPage from '../MainPage/MainPage';
import Calendar from '../Calendar/Calendar';
import AboutUs from '../AboutUs/AboutUs';
import Account from '../Account/Account';
import PageNotFound from '../PageNotFound/PageNotFound';

function Main({
  isAuthorized, isBooked, openConfirmationPopup, openAboutEventPopup
}) {
  const [isSelected, setIsSelected] = useState(false);
  // данные всей страницы с сервера
  const [dataCalendar, setDataCalendar] = useState(null);

  function handleClickSelectedButton() {
    setIsSelected(true);
  }

  useEffect(() => {
    getCalendarPageData()
      .then((res) => setDataCalendar(res.data.calendarPageData))
      .catch((err) => console.log(err));
  }, [setDataCalendar]);

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
            onEventSignUpClick={openConfirmationPopup}
            onEventFullDescriptionClick={openAboutEventPopup}
            clickButton={handleClickSelectedButton}
            isSelected={isSelected}
            dataCalendar={dataCalendar}
            isBooked={isBooked}
          />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
      {/* <PopupConfirmation
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
      /> */}
    </main>
  );
}

Main.propTypes = {
  isAuthorized: PropTypes.bool,
  isBooked: PropTypes.bool,
  openConfirmationPopup: PropTypes.func,
  openAboutEventPopup: PropTypes.func
};

Main.defaultProps = {
  isAuthorized: false,
  isBooked: false,
  openConfirmationPopup: undefined,
  openAboutEventPopup: undefined
};

export default Main;
