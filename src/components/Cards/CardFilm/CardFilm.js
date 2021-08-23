import './CardFilm.scss';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { PopupsContext } from '../../../contexts/index';
import { TitleH2, Card, Caption, Rubric } from '../../utils/index';
import { changeCaseOfFirstLetter, formatDuration } from '../../../utils/utils';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStChosenVideo } from '../../../config/constants';
import parserLinkYoutube from '../../../utils/parser-link-youtube';

function CardFilm({
  data: { image, title, info, link, tags, duration },
  sectionClass,
  isVideo,
}) {
  const { openPopupVideo } = useContext(PopupsContext);
  // Пробрасываем данные в попап
  const handleClick = () => {
    // записать дату в локал, ключ вынести в константы
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

  // Рендерим верхную часть с фоткой
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
          alt={`${texts.altText} ${title}`}
          className="card-film__preview image-scale"
        />
        {duration ? (
          <span className="card-film__duration paragraph">
            {durationString}
          </span>
        ) : (
          <ul className="card-film__rubric-list">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Rubric title={tag.name} sectionClass="card-film__rubric" />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  // Редерим либо кнопку либо ссылку в зависимости от ширины
  // Пробрасываем елементы в функцию в завизимости от положения
  const renderVideoPlayback = (childrenElem) =>
    !isMobile ? (
      <button
        className="link card-film__button"
        type="button"
        onClick={handleClick}
      >
        {childrenElem}
      </button>
    ) : (
      <a
        href={link}
        className="link card-film__button"
        rel="noopener noreferrer"
        target="_blank"
      >
        {childrenElem}
      </a>
    );

  return (
    <Card sectionClass={`card-film ${sectionClass}`}>
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
        {link &&
          renderVideoPlayback(
            isVideo ? texts.linkTextVideo : texts.linkTextMovie
          )}
      </div>
    </Card>
  );
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
