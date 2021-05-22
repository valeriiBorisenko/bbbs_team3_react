import './CardVideoMain.scss';
import PropTypes from 'prop-types';

function CardVideoMain({
  title, info, link, imageUrl, handleClick
}) {
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
  handleClick: PropTypes.func
};

CardVideoMain.defaultProps = {
  title: '',
  info: '',
  link: '',
  imageUrl: '',
  handleClick: undefined
};

export default CardVideoMain;
