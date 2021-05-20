import './CardVideoMain.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function CardVideoMain({
  title, info, link, imageUrl
}) {
  return (
    <>
      <div className="card-video-main">
        <div className="card-video-main__title-wrap">
          <Link to="/video" className="card-video-main__link">
            <h2 className="section-title card-video-main__title">{title}</h2>
          </Link>
          <p className="caption card-video-main__info">{info}</p>
        </div>
        <a href={link} className="link card-video-main__link">
          смотреть видео
        </a>
      </div>
      <div className="card-video-main__video">
        <Link to="/video" className="card-video-main__link">
          <img
            src={imageUrl}
            alt="Превью видео"
            className="card-video-main__image"
          />
        </Link>
      </div>
    </>
  );
}

CardVideoMain.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};

export default CardVideoMain;
