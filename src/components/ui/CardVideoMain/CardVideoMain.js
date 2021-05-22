import './CardVideoMain.scss';
import PropTypes from 'prop-types';
import formatDuration from '../../../utils/utils';

function CardVideoMain({
  title, info, link, imageUrl, duration, handleClick
}) {
  const { hours, minutes, seconds } = formatDuration(duration);
  return (
    <>
      <div className="card-video-main">
        <div className="card-video-main__title-wrap">
          <h2 className="section-title card-video-main__title">{title}</h2>
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
      </div>

      <div className="card-video-main__video">
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
      </div>
    </>
  );
}

CardVideoMain.propTypes = {
  title: PropTypes.string,
  info: PropTypes.string,
  link: PropTypes.string,
  imageUrl: PropTypes.string,
  duration: PropTypes.number,
  handleClick: PropTypes.func
};

CardVideoMain.defaultProps = {
  title: '',
  info: '',
  link: '',
  imageUrl: '',
  duration: 0,
  handleClick: undefined
};

export default CardVideoMain;
