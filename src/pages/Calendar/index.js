import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import { months } from '../../config/constants';
import BasePage from '../../layout/BasePage';
import TitleH1 from '../../components/utils/TitleH1/TitleH1';
import CardCalendar from '../../components/Cards/CardCalendar/CardCalendar';
import PseudoButtonTag from '../../components/utils/PseudoButtonTag/PseudoButtonTag';
import Loader from '../../components/utils/Loader/Loader';
import {
  renderFilterTags,
  changeCheckboxTagState,
  changeRadioTagState,
  selectOneTag,
  deselectOneTag
} from '../../utils/filter-tags';

export {
  CurrentUserContext,
  useSmoothScrollOnWindow,
  months,
  BasePage,
  TitleH1,
  CardCalendar,
  PseudoButtonTag,
  Loader,
  renderFilterTags,
  changeCheckboxTagState,
  changeRadioTagState,
  selectOneTag,
  deselectOneTag
};
