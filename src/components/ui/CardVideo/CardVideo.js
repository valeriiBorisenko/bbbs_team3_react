import './CardVideo.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';
import CardVideoInfo from '../CardVideoInfo/CardVideoInfo';

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
              <li key={tag.id}>
                <Rubric title={tag.name} />
              </li>
            ))}
          </ul>
        </Link>
      </div>
      <CardVideoInfo title={title} info={info} link={link} />
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
