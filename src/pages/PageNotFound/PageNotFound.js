import './PageNotFound.scss';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '../../hooks/index';
import { BasePage, AnimatedPageContainer } from './index';

function PageNotFound() {
  useScrollToTop();

  return (
    <BasePage>
      <Helmet>
        <title>Страницы не существует</title>
        <meta name="description" content="Запрашиваемая страница не найдена" />
      </Helmet>
      <AnimatedPageContainer
        is404
        titleText="К сожалению, запрашиваемая страница не найдена. Попробуйте перейти на главную страницу"
        buttonText="Вернуться на главную"
      />
    </BasePage>
  );
}

export default PageNotFound;
