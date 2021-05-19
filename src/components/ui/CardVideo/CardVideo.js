import './CardVideo.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardVideo({
  imageUrl, title, info
}) {
  return (
    <article className="card-video card-pagination_page_main">
      <div className="card-video__video">
        <Link to="/films" className="card-video__link-wrap">
          <img src={`${imageUrl}`} alt="Превью видео" className="card-video__preview" />
          <ul className="card-video__rubric-list">
            <li>
              <Rubric title="рубрика" />
            </li>
            <li>
              <Rubric title="рубрика" />
            </li>
          </ul>
        </Link>
      </div>
      <div className="card-video__video-info">
        <div className="card-video__title-wrap">
          <h2 className="card-video__title">{title}</h2>
          <p className="card-video__info">
            {info}
          </p>
        </div>
        <Link to="/films" className="card-video__link">
          смотреть трейлер
        </Link>
      </div>
    </article>
  );
}

CardVideo.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired
};

export default CardVideo;
