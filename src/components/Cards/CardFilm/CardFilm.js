import './CardFilm.scss';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { TitleH2, Card, Caption } from '../../utils/index';
import { changeCaseOfFirstLetter } from '../../../utils/utils';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';

function CardFilm({ data, onClick, children }) {
  const { image, title, info, link } = data;

  // Стейт записывает ширину окна
  const [windowWidth, setWindowWidth] = useState(0);

  // Пробрасываем данные в попап
  const handleClick = () => onClick(data);

  // Рендерим верхную часть с фоткой и props.children из компонета выше
  const renderPrewiew = () => (
    <>
      <img
        src={`${staticImageUrl}/${image}`}
        alt={`Превью к видео: ${title}`}
        className="card-film__preview"
      />
      {children}
    </>
  );

  // Редерим либо кнопку либо ссылку в зависимости от ширины
  // Пробрасываем елементы в функцию в завизимости от положения
  const renderVideoPlayback = (childrenElem) =>
    windowWidth >= 767 ? (
      <button
        className="link card-film__button"
        type="button"
        onClick={handleClick}
      >
        {childrenElem}
      </button>
    ) : (
      <a href={link} className="link card-film__button">
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
    <Card sectionClass="card-film">
      <div className="card-film__video">
        {renderVideoPlayback(renderPrewiew())}
      </div>

      <div className="card-film__video-info">
        <div className="card-film__title-wrap">
          <TitleH2
            sectionClass="card-film__title"
            title={changeCaseOfFirstLetter(title)}
          />
          <Caption
            sectionClass="card-film__info"
            title={changeCaseOfFirstLetter(info)}
          />
        </div>
        {link && renderVideoPlayback(texts.lintText)}
      </div>
    </Card>
  );
}

CardFilm.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  children: PropTypes.node,
};

CardFilm.defaultProps = {
  data: {},
  onClick: () => {},
  children: null,
};

export default CardFilm;
