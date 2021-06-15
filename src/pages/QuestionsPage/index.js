import { ALL_CATEGORIES } from '../WhereToGo';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { questionForm } from '../../utils/utils';
import {
  renderFilterTags, changeCheckboxTagState, selectOneTag, deselectOneTag
} from '../../utils/filter-tags';
import BasePage from '../../layout/BasePage';
import TitleH1 from '../../components/utils/TitleH1/TitleH1';
import TitleH2 from '../../components/utils/TitleH2/TitleH2';
import CardQuestion from '../../components/Cards/CardQuestion/CardQuestion';
import Input from '../../components/utils/Input/Input';
import Button from '../../components/utils/Button/Button';
import Loader from '../../components/utils/Loader/Loader';

export {
  CurrentUserContext,
  ALL_CATEGORIES,
  useSmoothScrollOnWindow,
  questionForm,
  renderFilterTags,
  changeCheckboxTagState,
  selectOneTag,
  deselectOneTag,
  BasePage,
  TitleH1,
  TitleH2,
  CardQuestion,
  Input,
  Button,
  Loader
};
