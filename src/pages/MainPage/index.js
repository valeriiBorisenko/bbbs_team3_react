import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import { QUESTIONS_URL } from '../../config/routes';
import BasePage from '../../layout/BasePage';
import Loader from '../../components/utils/Loader/Loader';
import Card from '../../components/utils/Card/Card';
import CardStub from '../../components/Cards/CardStub/CardStub';
import CardCalendar from '../../components/Cards/CardCalendar/CardCalendar';
import CardPlace from '../../components/Cards/CardPlace/CardPlace';
import CardArticleBig from '../../components/Cards/CardArticleBig/CardArticleBig';
import CardFilm from '../../components/Cards/CardFilm/CardFilm';
import CardVideoMain from '../../components/Cards/CardVideoMain/CardVideoMain';
import Widget from '../../components/utils/Widget/Widget';
import CardQuestion from '../../components/Cards/CardQuestion/CardQuestion';

export {
  CurrentUserContext,
  useSmoothScrollOnWindow,
  QUESTIONS_URL,
  BasePage,
  Loader,
  Card,
  CardStub,
  CardCalendar,
  CardPlace,
  CardArticleBig,
  CardFilm,
  CardVideoMain,
  Widget,
  CardQuestion
};