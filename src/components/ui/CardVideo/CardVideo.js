import './CardVideo.scss';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardVideo({
  imageUrl, title, info, link, tags, handleClick
}) {
  return (
    <article className="card-video card-pagination_page_main">
      <div className="card-video__video">
        <button className="card-video__button" type="button" onClick={handleClick}>
          <img
            src={`${imageUrl}`}
            alt="Превью видео"
            className="card-video__preview"
          />
          <ul className="card-video__rubric-list">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Rubric title={tag.name} />
              </li>
            ))}
          </ul>
        </button>
      </div>

      <div className="card-video__video-info">
        <div className="card-video__title-wrap">
          <h2 className="section-title card-video__title">{title}</h2>
          <p className="caption card-video__info">{info}</p>
        </div>
        <button
          type="button"
          className="link card-video__button"
          href={link}
          onClick={handleClick}
        >
          смотреть трейлер
        </button>
      </div>
    </article>
  );
}

CardVideo.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
  link: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  handleClick: PropTypes.func
};

CardVideo.defaultProps = {
  imageUrl: '',
  title: '',
  info: '',
  link: '',
  tags: [],
  handleClick: undefined
};

export default CardVideo;
