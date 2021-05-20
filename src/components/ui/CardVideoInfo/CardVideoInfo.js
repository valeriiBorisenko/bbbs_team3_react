import './CardVideoInfo.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function CardVideoInfo({
  title, info, link, isChosen
}) {
  return (
    <div className={`card-video-info ${isChosen ? 'card-video-info_main' : ''}`}>
      <div className="card-video-info__title-wrap">
        {isChosen ? (
          <Link to="/video" className="card-video-info__link">
            <h2 className="section-title card-video-info__title">{title}</h2>
          </Link>
        )
          : (<h2 className="section-title card-video-info__title">{title}</h2>)}
        <p className="caption card-video-info__info">{info}</p>
      </div>
      <a href={link} className="link card-video-info__link">
        {isChosen ? 'смотреть видео' : 'смотреть трейлер'}
      </a>
    </div>
  );
}

CardVideoInfo.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  isChosen: PropTypes.bool
};

CardVideoInfo.defaultProps = {
  isChosen: false
};

export default CardVideoInfo;
