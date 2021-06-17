import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import { months } from '../../config/constants';
import BasePage from '../../layout/BasePage';
import TitleH1 from '../../components/utils/TitleH1/TitleH1';
import CardCalendar from '../../components/Cards/CardCalendar/CardCalendar';
import Loader from '../../components/utils/Loader/Loader';
import AnimatedPageContainer from '../../components/AnimatedPageContainer/AnimatedPageContainer';
import {
  renderFilterTags,
  changeRadioTagState
} from '../../utils/filter-tags';

export {
  CurrentUserContext,
  useSmoothScrollOnWindow,
  months,
  BasePage,
  TitleH1,
  CardCalendar,
  Loader,
  AnimatedPageContainer,
  renderFilterTags,
  changeRadioTagState
};
