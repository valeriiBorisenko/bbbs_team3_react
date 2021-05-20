import './CardPlace.scss';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardPlace({
  isChosen, color, title, name, imageUrl
}) {
  return (
    <div
      className={`card-place card-place_color_${isChosen ? 'yellow' : color} ${
        isChosen ? 'card-place_main' : ''
      }`}
    >
      <Rubric title="Выбор наставника" />
      <div className="card-place__title-wrap">
        <a href="./place.html" className="card-place__link-wrap">
          <h2 className="section-title card-place__title">{title}</h2>
        </a>
        <p className="caption card-place__name">{name}</p>
      </div>
      <a
        href="./place.html"
        className="card-place__link-wrap card-place__link-wrap_content_article-img"
      >
        <img
          src={imageUrl}
          alt="Сплав на байдарках"
          className="card-place__image"
        />
      </a>
      <a href="/" className="link card-place__link">
        перейти на сайт
      </a>
    </div>
  );
}

CardPlace.propTypes = {
  isChosen: PropTypes.bool,
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};

CardPlace.defaultProps = {
  isChosen: false,
  color: 'green'
};

export default CardPlace;
