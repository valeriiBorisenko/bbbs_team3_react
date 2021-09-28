import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import {
  ABOUT_US_URL,
  AFISHA_URL,
  ARTICLES_ID_PARAM,
  ARTICLES_URL,
  BOOKS_ID_PARAM,
  BOOKS_URL,
  CATALOG_ITEM_URL,
  CATALOG_URL,
  MAIN_PAGE_URL,
  MOVIES_URL,
  NOT_FOUND_URL,
  PLACES_ID_PARAM,
  PLACES_URL,
  PROFILE_URL,
  QUESTIONS_URL,
  READ_AND_WATCH_URL,
  RIGHTS_ARTICLE_URL,
  RIGHTS_URL,
  STORIES_ID_PARAM,
  STORIES_URL,
  VIDEO_URL,
} from '../config/routes';
import { Loader } from '../components/utils';
import MainPage from '../pages/MainPage/MainPage';

// ленивая загрузка страниц
const AboutUs = lazy(() => import('../pages/AboutUs/AboutUs'));
const Calendar = lazy(() => import('../pages/Calendar/Calendar'));
const Questions = lazy(() => import('../pages/Questions/Questions'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const Places = lazy(() => import('../pages/Places/Places'));
const Rights = lazy(() => import('../pages/Rights/Rights'));
const RightsArticle = lazy(() =>
  import('../pages/RightsArticle/RightsArticle')
);
const Movies = lazy(() => import('../pages/Movies/Movies'));
const ReadAndWatch = lazy(() => import('../pages/ReadAndWatch/ReadAndWatch'));
const Catalog = lazy(() => import('../pages/Catalog/Catalog'));
const CatalogArticle = lazy(() =>
  import('../pages/CatalogArticle/CatalogArticle')
);
const Video = lazy(() => import('../pages/Video/Video'));
const Books = lazy(() => import('../pages/Books/Books'));
const Articles = lazy(() => import('../pages/Articles/Articles'));
const Stories = lazy(() => import('../pages/Stories/Stories'));
const PageNotFound = lazy(() => import('../pages/PageNotFound/PageNotFound'));

function Router() {
  return (
    <Suspense fallback={<Loader isCentered />}>
      <Switch>
        <Route exact path={MAIN_PAGE_URL} component={MainPage} />

        <Route exact path={ABOUT_US_URL} component={AboutUs} />

        <Route exact path={AFISHA_URL} component={Calendar} />

        <Route exact path={QUESTIONS_URL} component={Questions} />

        <ProtectedRoute exact path={PROFILE_URL} component={Profile} />

        <Route path={`${PLACES_URL}/${PLACES_ID_PARAM}?`} component={Places} />

        <Route exact path={RIGHTS_URL} component={Rights} />

        <Route path={RIGHTS_ARTICLE_URL} component={RightsArticle} />

        <Route exact path={MOVIES_URL} component={Movies} />

        <Route exact path={READ_AND_WATCH_URL} component={ReadAndWatch} />

        <Route exact path={CATALOG_URL} component={Catalog} />

        <Route path={CATALOG_ITEM_URL} component={CatalogArticle} />

        <Route exact path={VIDEO_URL} component={Video} />

        <Route path={`${BOOKS_URL}/${BOOKS_ID_PARAM}?`} component={Books} />

        <Route
          path={`${ARTICLES_URL}/${ARTICLES_ID_PARAM}?`}
          component={Articles}
        />

        <Route
          path={`${STORIES_URL}/${STORIES_ID_PARAM}?`}
          component={Stories}
        />

        <Route path={NOT_FOUND_URL} component={PageNotFound} />
      </Switch>
    </Suspense>
  );
}

export default Router;
