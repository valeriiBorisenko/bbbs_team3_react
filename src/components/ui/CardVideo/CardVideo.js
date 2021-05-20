/* eslint-disable dot-notation */
import './CardVideo.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardVideo({
  imageUrl, title, info, link, tags
}) {
  return (
    <article className="card-video card-pagination_page_main">
      <div className="card-video__video">
        <Link to="/films" className="card-video__link-wrap">
          <img
            src={`${imageUrl}`}
            alt="Превью видео"
            className="card-video__preview"
          />
          <ul className="card-video__rubric-list">
            {tags.map((tag) => (
              <li key={tag['id']}>
                <Rubric title={tag['name']} />
              </li>
            ))}
          </ul>
        </Link>
      </div>
      <div className="card-video__video-info">
        <div className="card-video__title-wrap">
          <h2 className="section-title card-video__title">{title}</h2>
          <p className="caption card-video__info">{info}</p>
        </div>
        <a href={link} className="card-video__link">
          смотреть трейлер
        </a>
      </div>
    </article>
  );
}

CardVideo.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object)
};

CardVideo.defaultProps = {
  tags: []
};

export default CardVideo;
