import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import { repeatSchema } from '../../utils/utils';
import { COLORS, NO_CATEGORIES } from '../../config/constants';
import BasePage from '../../layout/BasePage';
import TitleH1 from '../../components/utils/TitleH1/TitleH1';
import CardPlace from '../../components/Cards/CardPlace/CardPlace';
import WhereToGoPreview from '../../components/WhereToGoPreview/WhereToGoPreview';
import {
  renderFilterTags, changeCheckboxTagState, changeRadioTagState, selectOneTag, deselectOneTag
} from '../../utils/filter-tags';

export {
  CurrentUserContext,
  useSmoothScrollOnWindow,
  repeatSchema,
  COLORS,
  NO_CATEGORIES,
  BasePage,
  TitleH1,
  CardPlace,
  WhereToGoPreview,
  renderFilterTags,
  changeCheckboxTagState,
  changeRadioTagState,
  selectOneTag,
  deselectOneTag
};
