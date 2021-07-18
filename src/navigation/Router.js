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
  Video,
  Articles,
  Books,
  CatalogArticle,
  RightsArticle,
  Stories,
} from '../pages/index';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
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
  VIDEO_URL,
  ARTICLES_URL,
  BOOKS_URL,
  CATALOG_ITEM_URL,
  RIGHTS_ARTICLE_URL,
  STORIES_URL,
} from '../config/routes';

function Router() {
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

      <ProtectedRoute exact path={PROFILE_URL} component={Profile} />

      <Route exact path={PLACES_URL}>
        <Places />
      </Route>

      <Route exact path={RIGHTS_URL}>
        <Rights />
      </Route>

      <Route
        path={RIGHTS_ARTICLE_URL}
        render={({ match }) => <RightsArticle id={match.params.id} />}
      />

      <Route exact path={MOVIES_URL}>
        <Movies />
      </Route>

      <Route exact path={READ_AND_WATCH_URL}>
        <ReadAndWatch />
      </Route>

      <Route exact path={CATALOG_URL}>
        <Catalog />
      </Route>

      <Route
        path={CATALOG_ITEM_URL}
        render={({ match }) => (
          <CatalogArticle articleId={match.params.articleId} />
        )}
      />
      <Route exact path={VIDEO_URL}>
        <Video />
      </Route>

      <Route exact path={BOOKS_URL}>
        <Books />
      </Route>

      <Route exact path={ARTICLES_URL}>
        <Articles />
      </Route>

      <Route exact path={STORIES_URL}>
        <Stories />
      </Route>

      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
}

export default Router;
