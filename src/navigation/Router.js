import { Route, Switch } from 'react-router-dom';
import {
  AboutUs,
  Articles,
  Books,
  Calendar,
  Catalog,
  CatalogArticle,
  MainPage,
  Movies,
  PageNotFound,
  Places,
  Profile,
  Questions,
  ReadAndWatch,
  Rights,
  RightsArticle,
  Stories,
  Video,
} from '../pages';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import {
  ABOUT_US_URL,
  AFISHA_URL,
  ARTICLES_URL,
  BOOKS_URL,
  CATALOG_ITEM_URL,
  CATALOG_URL,
  MAIN_PAGE_URL,
  MOVIES_URL,
  NOT_FOUND_URL,
  PLACES_URL,
  PROFILE_URL,
  QUESTIONS_URL,
  READ_AND_WATCH_URL,
  RIGHTS_ARTICLE_URL,
  RIGHTS_URL,
  STORIES_URL,
  VIDEO_URL,
} from '../config/routes';

function Router() {
  return (
    <Switch>
      <Route exact path={MAIN_PAGE_URL} component={MainPage} />

      <Route exact path={ABOUT_US_URL} component={AboutUs} />

      <Route exact path={AFISHA_URL} component={Calendar} />

      <Route exact path={QUESTIONS_URL} component={Questions} />

      <ProtectedRoute exact path={PROFILE_URL} component={Profile} />

      <Route exact path={PLACES_URL} component={Places} />

      <Route exact path={RIGHTS_URL} component={Rights} />

      <Route path={RIGHTS_ARTICLE_URL} component={RightsArticle} />

      <Route exact path={MOVIES_URL} component={Movies} />

      <Route exact path={READ_AND_WATCH_URL} component={ReadAndWatch} />

      <Route exact path={CATALOG_URL} component={Catalog} />

      <Route path={CATALOG_ITEM_URL} component={CatalogArticle} />

      <Route exact path={VIDEO_URL} component={Video} />

      <Route exact path={BOOKS_URL} component={Books} />

      <Route exact path={ARTICLES_URL} component={Articles} />

      <Route path={`${STORIES_URL}/:storyId?`} component={Stories} />

      <Route path={NOT_FOUND_URL} component={PageNotFound} />
    </Switch>
  );
}

export default Router;
