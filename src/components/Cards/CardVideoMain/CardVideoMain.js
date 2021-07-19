import './CardVideoMain.scss';
import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { PopupsContext } from '../../../contexts/index';
import { Card, TitleH2, Caption } from '../../utils/index';
import { formatDuration, changeCaseOfFirstLetter } from '../../../utils/utils';
import { staticImageUrl } from '../../../config/config';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStChosenVideo } from '../../../config/constants';
import parserLinkYoutube from '../../../utils/parser-link-youtube';

function CardVideoMain({ data: { title, info, link, image, duration } }) {
  const { openPopupVideo } = useContext(PopupsContext);

  // Пробрасываем данные в попап
  const handleClick = () => {
    setLocalStorageData(localStChosenVideo, {
      title,
      info,
      link,
      image,
      duration,
    });
    openPopupVideo();
    // записать дату в локал, ключ вынести в константы
  };

  // Стейт записывает ширину окна
  const [isMobile, setIsMobile] = useState(false);

  const { imagePreview } = parserLinkYoutube(link);

  // Следит за шириной экрана и записывает в стейт
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');

    const listener = () => {
      if (mobile.matches) setIsMobile(true);
      else setIsMobile(false);
    };
    listener();

    mobile.addEventListener('change', listener);

    return () => {
      mobile.removeEventListener('change', listener);
    };
  }, []);

  // Рендерим верхную часть с фоткой и props.children из компонета выше
  const renderPrewiew = () => {
    let durationString = '';

    if (duration) {
      const { hours, minutes, seconds } = formatDuration(duration);
      durationString =
        hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
    }

    return (
      <>
        <img
          src={`${staticImageUrl}/${image}` || imagePreview}
          alt={`${texts.imageAlt}: ${title}`}
          className="card-video-main__image"
        />

        <span className="card-video-main__duration paragraph">
          {durationString}
        </span>
      </>
    );
  };

  // Редерим либо кнопку либо ссылку в зависимости от ширины
  // Пробрасываем елементы в функцию в завизимости от положения
  const renderVideoPlayback = (childrenElem) =>
    !isMobile ? (
      <button
        className="link card-video-main__button"
        type="button"
        onClick={handleClick}
      >
        {childrenElem}
      </button>
    ) : (
      <a
        href={link}
        className="link card-video-main__button"
        rel="noopener noreferrer"
        target="_blank"
      >
        {childrenElem}
      </a>
    );

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
};

CardVideoMain.defaultProps = {
  data: {},
};

export default CardVideoMain;
