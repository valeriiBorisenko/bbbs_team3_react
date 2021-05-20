import './Main.scss';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import MainPage from '../MainPage/MainPage';

function Main({ isAuthorized }) {
  return (
    <main className="main">
      <Switch>
        <Route exact path="/">
          <MainPage isAuthorized={isAuthorized} />
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
