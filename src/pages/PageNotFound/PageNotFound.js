import './PageNotFound.scss';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BasePage, AnimatedPageContainer } from './index';

function PageNotFound() {
  // поднятие страницы к хедеру при загрузке
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
