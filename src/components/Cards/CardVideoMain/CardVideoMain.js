import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { PopupsContext } from '../../../contexts';
import { Caption, Card, TitleH2 } from '../../utils';
import { changeCaseOfFirstLetter, formatDuration } from '../../../utils/utils';
import { staticImageUrl } from '../../../config/config';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStChosenVideo } from '../../../config/constants';
import parserLinkYoutube from '../../../utils/parser-link-youtube';
import './CardVideoMain.scss';

const mobileWidth = '767px';

function CardVideoMain({ data: { id, title, info, link, image, duration } }) {
  const { openPopupVideo } = useContext(PopupsContext);
  const { frameSrc } = parserLinkYoutube(link);

  const [isMobile, setIsMobile] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Пробрасываем данные в попап
  const openPopupVideoOnClick = () => {
    setLocalStorageData(localStChosenVideo, {
      title,
      info,
      link,
      image,
      duration,
    });
    openPopupVideo();
  };

  // на мобильном разрешении видео проиграывается сразу в карточке
  const playVideoOnClick = () => {
    setIsPlayingVideo(true);
  };

  // Следит за шириной экрана и записывает в стейт
  useEffect(() => {
    const mobile = window.matchMedia(`(max-width: ${mobileWidth})`);

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
        {link && (
          <button
            className="link"
            type="button"
            onClick={isMobile ? playVideoOnClick : openPopupVideoOnClick}
          >
            {texts.linkText}
          </button>
        )}
      </Card>

      <Card sectionClass="card-video-main__video">{renderVideoPlayback()}</Card>
    </div>
  );

  // Рендерим верхную часть с фоткой и props.children из компонета выше
  function renderPreview() {
    let durationString = '';

    if (duration) {
      const { hours, minutes, seconds } = formatDuration(duration);
      durationString =
        hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
    }

    return (
      <>
        <img
          src={`${staticImageUrl}/${image}`}
          alt={`${texts.imageAlt}: ${title}`}
          className={`card-video-main__image ${
            isPlayingVideo ? 'card-video-main__image_at-back' : ''
          } image-scale`}
        />

        <span className="card-video-main__duration paragraph">
          {durationString}
        </span>
      </>
    );
  }

  function renderVideoPlayback() {
    if (isMobile) {
      return (
        <button
          className="card-video-main__button"
          type="button"
          onClick={playVideoOnClick}
          draggable="false"
        >
          {renderPreview()}
          {isPlayingVideo && (
            <iframe
              title={title}
              id={`player-card-film-${id}`}
              className="card-film__iframe"
              src={`${frameSrc}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              seamless
            />
          )}
        </button>
      );
    }

    return (
      <button
        className="card-video-main__button"
        type="button"
        onClick={openPopupVideoOnClick}
      >
        {renderPreview()}
      </button>
    );
  }
}

CardVideoMain.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};

CardVideoMain.defaultProps = {
  data: {},
};

export default CardVideoMain;
