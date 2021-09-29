import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { PopupsContext } from '../../../contexts';
import { Caption, Card, Rubric, TitleH2 } from '../../utils';
import { changeCaseOfFirstLetter, formatDuration } from '../../../utils/utils';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStChosenVideo } from '../../../config/constants';
import parserLinkYoutube from '../../../utils/parser-link-youtube';
import './CardFilm.scss';

const mobileWidth = '767px';

function CardFilm({
  data: { id, image, title, info, link, tags, duration },
  sectionClass,
  isVideo,
}) {
  const { openPopupVideo } = useContext(PopupsContext);
  const { frameSrc } = parserLinkYoutube(link);

  const [isMobile, setIsMobile] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Пробрасываем данные в попап
  const openPopupVideoOnClick = () => {
    setLocalStorageData(localStChosenVideo, {
      image,
      title,
      info,
      link,
      tags,
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
    <Card sectionClass={`card-film ${sectionClass}`}>
      <div className="card-film__video">{renderVideoPlayback()}</div>

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
        {link && (
          <button
            className="link"
            type="button"
            onClick={isMobile ? playVideoOnClick : openPopupVideoOnClick}
            draggable="false"
          >
            {isVideo ? texts.linkTextVideo : texts.linkTextMovie}
          </button>
        )}
      </div>
    </Card>
  );

  // Рендерим верхную часть с фоткой
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
          draggable="false"
          src={`${staticImageUrl}/${image}`}
          alt={`${texts.altText} ${title}`}
          className={`card-film__preview ${
            isPlayingVideo ? 'card-film__preview_at-back' : ''
          } image-scale`}
        />
        {renderDurationOrTags(durationString)}
      </>
    );
  }

  function renderVideoPlayback() {
    if (isMobile) {
      return (
        <button
          className="card-film__button"
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
        className="card-film__button"
        type="button"
        onClick={openPopupVideoOnClick}
        draggable="false"
      >
        {renderPreview()}
      </button>
    );
  }

  function renderDurationOrTags(durationString) {
    if (!isPlayingVideo && duration) {
      return (
        <span className="card-film__duration paragraph">{durationString}</span>
      );
    }

    if (!isPlayingVideo) {
      return (
        <ul className="card-film__rubric-list">
          {tags.map((tag) => (
            <li key={tag.id}>
              <Rubric title={tag.name} sectionClass="card-film__rubric" />
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }
}

CardFilm.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  image: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
  link: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sectionClass: PropTypes.string,
  isVideo: PropTypes.bool,
};

CardFilm.defaultProps = {
  data: {},
  image: '',
  title: '',
  info: '',
  link: '',
  tags: [],
  duration: '',
  sectionClass: '',
  isVideo: false,
};

export default CardFilm;
