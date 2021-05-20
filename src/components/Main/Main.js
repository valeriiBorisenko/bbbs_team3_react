import './Main.scss';
import { Route, Switch } from 'react-router-dom';
import MainPage from '../MainPage/MainPage';

function Main() {
  return (
    <main className="main">
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
      </Switch>
    </main>
  );
}

export default Main;
