import { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  AboutUs,
  Profile,
  Calendar,
  MainPage,
  PageNotFound,
  Catalog,
  Questions,
  Places,
  Rights,
  Movies,
  ReadAndWatch,
} from '../pages/index';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { CurrentUserContext } from '../contexts/index';
import {
  MAIN_PAGE_URL,
  ABOUT_US_URL,
  AFISHA_URL,
  QUESTIONS_URL,
  PLACES_URL,
  RIGHTS_URL,
  MOVIES_URL,
  READ_AND_WATCH_URL,
  CATALOG_URL,
  PROFILE_URL,
} from '../config/routes';

function Router() {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Switch>
      <Route exact path={MAIN_PAGE_URL}>
        <MainPage />
      </Route>

      <Route exact path={ABOUT_US_URL}>
        <AboutUs />
      </Route>

      <Route exact path={AFISHA_URL}>
        <Calendar />
      </Route>

      <Route exact path={QUESTIONS_URL}>
        <Questions />
      </Route>

      <ProtectedRoute
        exact
        path={PROFILE_URL}
        component={Profile}
        isAuth={!!currentUser}
      />

      <Route exact path={PLACES_URL}>
        <Places />
      </Route>

      <Route exact path={RIGHTS_URL}>
        <Rights />
      </Route>

      <Route exact path={MOVIES_URL}>
        <Movies />
      </Route>

      <Route exact path={READ_AND_WATCH_URL}>
        <ReadAndWatch />
      </Route>

      <Route exact path={CATALOG_URL}>
        <Catalog />
      </Route>

      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
}

export default Router;
