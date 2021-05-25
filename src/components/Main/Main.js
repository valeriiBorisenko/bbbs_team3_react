import './Main.scss';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import MainPage from '../MainPage/MainPage';
import AboutUs from '../AboutUs/AboutUs';
import Account from '../Account/Account';
import PageNotFound from '../PageNotFound/PageNotFound';
import Calendar from '../Calendar/Calendar';

function Main({ isAuthorized }) {
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
        <Route>
          <Calendar
            exact
            path="/calendar"
            isAuthorized={isAuthorized}
          />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
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
