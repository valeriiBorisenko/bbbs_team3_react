import './CardVideoInfo.scss';
import PropTypes from 'prop-types';

function CardVideoInfo({
  title, info, link
}) {
  return (
    <div className="card-video-info">
      <div className="card-video-info__title-wrap">
        <h2 className="section-title card-video-info__title">{title}</h2>
        <p className="caption card-video-info__info">{info}</p>
      </div>
      <a href={link} className="card-video-info__link">
        смотреть трейлер
      </a>
    </div>
  );
}

CardVideoInfo.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default CardVideoInfo;
