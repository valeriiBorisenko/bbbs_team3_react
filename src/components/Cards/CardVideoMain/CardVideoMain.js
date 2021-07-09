import './CardVideoMain.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, TitleH2, Caption } from '../../utils/index';
import { formatDuration, changeCaseOfFirstLetter } from '../../../utils/utils';
import { staticImageUrl } from '../../../config/config';

function CardVideoMain({ data, onClick }) {
  const { title, info, link, image, duration } = data;
  const { hours, minutes, seconds } = formatDuration(duration);

  // Стейт записывает ширину окна
  const [windowWidth, setWindowWidth] = useState(0);

  // Пробрасываем данные в попап
  const handleClick = () => onClick(data);

  // Рендерим верхную часть с фоткой и props.children из компонета выше
  const renderPrewiew = () => (
    <>
      <img
        src={`${staticImageUrl}/${image}`}
        alt={`${texts.imageAlt}: ${title}`}
        className="card-video-main__image"
      />

      {hours > 0 ? (
        <span className="card-video-main__duration paragraph">{`${hours}:${minutes}:${seconds}`}</span>
      ) : (
        <span className="card-video-main__duration paragraph">{`${minutes}:${seconds}`}</span>
      )}
    </>
  );

  // Редерим либо кнопку либо ссылку в зависимости от ширины
  // Пробрасываем елементы в функцию в завизимости от положения
  const renderVideoPlayback = (childrenElem) =>
    windowWidth >= 767 ? (
      <button
        className="link card-video-main__button card-video-main__button_video"
        type="button"
        onClick={handleClick}
      >
        {childrenElem}
      </button>
    ) : (
      <a
        href={link}
        className="link card-video-main__button card-video-main__button_video"
      >
        {childrenElem}
      </a>
    );

  // Следит за шириной экрана и записывает в стейт
  // Стоит таймер для ограничения отрисовок
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const timer = setTimeout(() => {
      setWindowWidth(window.innerWidth);
    }, 5000);
    return () => clearTimeout(timer);
  }, [window.innerWidth]);

  return (
    <div className="card-container card-container_type_main-video">
      <Card sectionClass="card-video-main" color="yellow">
        <div className="card-video-main__title-wrap">
          <TitleH2
            sectionClass="card-video-main__title"
            title={changeCaseOfFirstLetter(title)}
          />
          <Caption
            sectionClass="card-video-main__info"
            title={changeCaseOfFirstLetter(info)}
          />
        </div>
        {link && renderVideoPlayback(texts.linkText)}
      </Card>

      <Card sectionClass="card-video-main__video">
        {renderVideoPlayback(renderPrewiew())}
      </Card>
    </div>
  );
}

CardVideoMain.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
};

CardVideoMain.defaultProps = {
  data: {},
  onClick: () => {},
};

export default CardVideoMain;
