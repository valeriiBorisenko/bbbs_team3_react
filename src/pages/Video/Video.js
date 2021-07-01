import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Video.scss';
import { BasePage, Loader, TitleH1 } from './index';

import { useScrollToTop } from '../../hooks/index';

const Video = () => {
  useScrollToTop();

  // Загрузка данных
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4 * 1000);
  }, []);

  // глобальный лоадер
  if (isLoading) {
    return <Loader isCentered />;
  }
  return (
    <BasePage>
      <Helmet>
        <title>Видео</title>
        <meta name="description" content="Страница с видео контентом" />
      </Helmet>
      <TitleH1 title="Видео" />
    </BasePage>
  );
};

export default Video;
