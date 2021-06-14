import { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AboutUs,
  Account,
  Calendar,
  MainPage,
  PageNotFound,
  QuestionsPage,
  WhereToGo
} from '../pages/index';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import CurrentUserContext from '../contexts/CurrentUserContext';
import {
  MainPageUrl, AboutUsUrl, AfishaUrl, QuestionsUrl, AccountUrl, PlacesUrl
} from '../config/routes';

function Router({
  handlers: {
    bookingHandler,
    handleClickPopupAboutEventOpened,
    handleClickPopupLoginOpened,
    handleClickPopupCities,
    dataMain,
    dataCalendar
  }
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Switch>
      <Route exact path={MainPageUrl}>
        <MainPage
          onEventSignUpClick={bookingHandler}
          onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
          dataMain={dataMain}
        />
      </Route>
      <Route exact path={AboutUsUrl}>
        <AboutUs />
      </Route>
      <Route path={AfishaUrl}>
        <Calendar
          onEventSignUpClick={bookingHandler}
          onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
          onOpenLoginPopup={handleClickPopupLoginOpened}
          dataCalendar={dataCalendar}
        />
      </Route>
      <Route path={QuestionsUrl}>
        <QuestionsPage />
      </Route>
      <ProtectedRoute
        exact
        path={AccountUrl}
        component={Account}
        onEventFullDescriptionClick={handleClickPopupAboutEventOpened}
        eventsData={dataCalendar}
        isAuth={!!currentUser}
      />
      <Route exact path={PlacesUrl}>
        <WhereToGo
          openPopupCities={handleClickPopupCities}
        />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
}

Router.propTypes = {
  handlers: PropTypes.objectOf(PropTypes.any)
};

Router.defaultProps = {
  handlers: {}
};

export default Router;
