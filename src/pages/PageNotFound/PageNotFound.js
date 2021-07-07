import './PageNotFound.scss';
import page404Texts from '../../locales/404-page-RU';
import { useScrollToTop } from '../../hooks/index';
import { BasePage, AnimatedPageContainer } from './index';

function PageNotFound() {
  const { headTitle, headDescription, animatedContainerText } = page404Texts;

  useScrollToTop();

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <AnimatedPageContainer titleText={animatedContainerText} is404 />
    </BasePage>
  );
}

export default PageNotFound;
