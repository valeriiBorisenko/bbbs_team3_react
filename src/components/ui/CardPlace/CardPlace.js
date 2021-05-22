import './CardPlace.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardPlace({
  isChosen,
  color,
  title,
  name,
  imageUrl,
  link,
  mix
}) {
  return (
    <div className={`card-place card-place_color_${color} ${mix}`}>

      {isChosen && <Rubric title="Выбор наставника" />}

      <div className="card-place__title-wrap">
        <Link to="/place" className="card-place__link-wrap">
          <h2 className="section-title card-place__title">{title}</h2>
        </Link>
        <p className="caption card-place__name">{name}</p>
      </div>

      {isChosen && (
        <Link
          to="/place"
          className="card-place__link-wrap card-place__link-wrap_content_article-img"
        >
          <img src={imageUrl} alt={title} className="card-place__image" />
        </Link>
      )}

      <a
        href={link}
        className="link card-place__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        перейти на сайт
      </a>
    </div>
  );
}

CardPlace.propTypes = {
  isChosen: PropTypes.bool,
  color: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
  mix: PropTypes.string
};

CardPlace.defaultProps = {
  isChosen: false,
  color: 'green',
  title: '',
  name: '',
  imageUrl: '',
  link: '',
  mix: ''
};

export default CardPlace;
