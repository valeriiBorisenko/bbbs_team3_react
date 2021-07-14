import './PageNotFound.scss';
import page404Texts from '../../locales/404-page-RU';
import { useScrollToTop } from '../../hooks/index';
import { PageNoFooter, AnimatedPageContainer } from './index';

const { headTitle, headDescription, animatedContainerText } = page404Texts;

function PageNotFound() {
  useScrollToTop();

  return (
    <PageNoFooter headTitle={headTitle} headDescription={headDescription}>
      <AnimatedPageContainer titleText={animatedContainerText} is404 />
    </PageNoFooter>
  );
}

export default PageNotFound;
