import { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AboutUs,
  Account,
  Calendar,
  MainPage,
  PageNotFound,
  Questions,
  Places,
} from '../pages/index';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import CurrentUserContext from '../contexts/CurrentUserContext';
import {
  MAIN_PAGE_URL,
  ABOUT_US_URL,
  AFISHA_URL,
  QUESTIONS_URL,
  ACCOUNT_URL,
  PLACES_URL,
} from '../config/routes';

function Router({
  handlers: {
    bookingHandler,
    handleClickPopupAboutEventOpened,
    handleClickPopupLoginOpened,
    handleClickPopupCities,
    dataMain,
    dataCalendar,
  },
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Switch>
      <Route exact path={MAIN_PAGE_URL}>
        <MainPage
          onEventSignUpClick={bookingHandler}
          onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
          dataMain={dataMain}
        />
      </Route>
      <Route exact path={ABOUT_US_URL}>
        <AboutUs />
      </Route>
      <Route path={AFISHA_URL}>
        <Calendar
          onEventSignUpClick={bookingHandler}
          onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
          onOpenLoginPopup={handleClickPopupLoginOpened}
          dataCalendar={dataCalendar}
        />
      </Route>
      <Route path={QUESTIONS_URL}>
        <Questions />
      </Route>
      <ProtectedRoute
        exact
        path={ACCOUNT_URL}
        component={Account}
        onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
        eventsData={dataCalendar}
        isAuth={!!currentUser}
      />
      <Route exact path={PLACES_URL}>
        <Places openPopupCities={handleClickPopupCities} />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
}

Router.propTypes = {
  handlers: PropTypes.objectOf(PropTypes.any),
};

Router.defaultProps = {
  handlers: {},
};

export default Router;
