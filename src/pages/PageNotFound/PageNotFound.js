import page404Texts from './locales/RU';
import { AnimatedPageContainer, BasePage } from './index';
import './PageNotFound.scss';

const { headTitle, headDescription, animatedContainerText } = page404Texts;

function PageNotFound() {
  return (
    <BasePage
      headTitle={headTitle}
      headDescription={headDescription}
      isNoFooter
      sectionClassMain="main__not-found"
    >
      <AnimatedPageContainer titleText={animatedContainerText} is404 />
    </BasePage>
  );
}

export default PageNotFound;
