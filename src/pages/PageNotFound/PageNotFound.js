import { useEffect, useRef } from 'react';
import './PageNotFound.scss';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Lottie from 'lottie-web';
import { BasePage, animation404, TitleH2 } from './index';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';

function PageNotFound() {
  useSmoothScrollOnWindow({ top: 0 });

  const animationContainer = useRef();

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animation404
    });
  }, []);

  return (
    <BasePage>
      <Helmet>
        <title>Страницы не существует</title>
        <meta name="description" content="Запрашиваемая страница не найдена" />
      </Helmet>
      <div className="page-not-found">
        <div ref={animationContainer} className="page-not-found__animation" />
        <h1 className="page-not-found__title">404</h1>
        <TitleH2
          title="К сожалению, запрашиваемая страница не найдена. Попробуйте перейти на главную страницу"
          sectionClass="page-not-found__subtitle"
        />
        <Link
          className="button page-not-found__link button_color_blue"
          to="/"
        >
          Вернуться на главную
        </Link>
      </div>
    </BasePage>
  );
}

export default PageNotFound;
