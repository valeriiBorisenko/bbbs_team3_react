import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { PopupsContext } from '../../../contexts';
import { Caption, Card, Heading, Rubric, StyledLink } from '../../utils';
import {
  changeCaseOfFirstLetter,
  formatDuration,
  refineClassNames,
} from '../../../utils/utils';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStChosenVideo } from '../../../config/constants';
import parserLinkYoutube from '../../../utils/parser-link-youtube';
import './CardFilm.scss';

function CardFilm({
  data: { id, image, title, info, link, tags, duration },
  sectionClass,
  isVideo,
  isMobile,
}) {
  const { openPopupVideo } = useContext(PopupsContext);
  const { frameSrc } = parserLinkYoutube(link);
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
  const playVideoOnClick = () => setIsPlayingVideo(true);

  useEffect(() => {
    if (!isMobile) {
      if (isPlayingVideo) setIsPlayingVideo(false);
    }
  }, [isMobile]);

  const classNames = {
    main: refineClassNames(['card-film', sectionClass]),
    preview: refineClassNames([
      'card-film__preview',
      isPlayingVideo ? 'card-film__preview_at-back' : '',
      'image-scale',
    ]),
  };

  return (
    <Card sectionClass={classNames.main}>
      <div className="card-film__video">{renderVideoPlayback()}</div>

      <div className="card-film__video-info">
        <div className="card-film__title-wrap">
          <Heading
            level={2}
            type="small"
            sectionClass="card-film__title"
            content={changeCaseOfFirstLetter(title)}
          />
          <Caption
            sectionClass="card-film__info"
            title={changeCaseOfFirstLetter(info)}
          />
        </div>
        {link && (
          <StyledLink
            text={isVideo ? texts.linkTextVideo : texts.linkTextMovie}
            onClick={isMobile ? playVideoOnClick : openPopupVideoOnClick}
            isButton
          />
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
          className={classNames.preview}
          loading="lazy"
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
  isMobile: PropTypes.bool,
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
  isMobile: false,
};

export default CardFilm;
