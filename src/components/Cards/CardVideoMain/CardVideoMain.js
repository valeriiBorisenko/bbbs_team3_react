import './CardVideoMain.scss';
import PropTypes from 'prop-types';
import { formatDuration } from '../../../utils/utils';
import { Card, TitleH2 } from './index';

function CardVideoMain({
  data: {
    title, info, link, imageUrl, duration
  },
  handleClick
}) {
  const { hours, minutes, seconds } = formatDuration(duration);

  return (
    <div className="card-container card-container_type_main-video">
      <Card sectionClass="card-video-main" color="yellow">
        <div className="card-video-main__title-wrap">
          <TitleH2 sectionClass="card-video-main__title" title={title} />
          <p className="caption card-video-main__info">{info}</p>
        </div>
        <button
          href={link}
          className="link card-video-main__button"
          type="button"
          onClick={handleClick}
        >
          смотреть видео
        </button>
      </Card>

      <Card sectionClass="card-video-main__video">
        <button
          className="card-video-main__button"
          type="button"
          onClick={handleClick}
        >
          <img
            src={imageUrl}
            alt="Превью видео"
            className="card-video-main__image"
          />
          {hours > 0 ? (
            <span className="card-video-main__duration paragraph">{`${hours}:${minutes}:${seconds}`}</span>
          ) : (
            <span className="card-video-main__duration paragraph">{`${minutes}:${seconds}`}</span>
          )}
        </button>
      </Card>
    </div>
  );
}

CardVideoMain.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  info: PropTypes.string,
  link: PropTypes.string,
  imageUrl: PropTypes.string,
  duration: PropTypes.number,
  handleClick: PropTypes.func
};

CardVideoMain.defaultProps = {
  data: {},
  title: '',
  info: '',
  link: '',
  imageUrl: '',
  duration: 0,
  handleClick: () => {}
};

export default CardVideoMain;
