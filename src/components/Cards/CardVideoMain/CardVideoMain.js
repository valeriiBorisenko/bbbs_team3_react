import './CardVideoMain.scss';
import PropTypes from 'prop-types';
import { formatDuration } from '../../../utils/utils';
import { Card, TitleH2 } from './index';

const BASE_MEDIA_URL = 'http://127.0.0.1/media/';

function CardVideoMain({ data, handleClick }) {
  const { title, info, link, image, duration } = data;
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
          className="card-video-main__button card-video-main__button_video"
          type="button"
          onClick={handleClick}
        >
          <img
            src={`${BASE_MEDIA_URL}${image}`}
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
  handleClick: PropTypes.func,
};

CardVideoMain.defaultProps = {
  data: {},
  handleClick: () => {},
};

export default CardVideoMain;
