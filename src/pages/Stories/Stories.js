import { BasePage, AnimatedPageContainer } from './index';
import storiesPageTexts from '../../locales/stories-page-RU';

const { headTitle, headDescription } = storiesPageTexts;
function Stories() {
  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <AnimatedPageContainer titleText="Данная страница пока находится в разработке. Приносим свои извинения!" />
    </BasePage>
  );
}

export default Stories;
