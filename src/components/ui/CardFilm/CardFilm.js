import './CardFilm.scss';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardFilm({
  imageUrl, title, info, link, tags, handleClick
}) {
  return (
    <article className="card-film">
      <div className="card-film__video">
        <button className="card-film__button" type="button" onClick={handleClick}>
          <img
            src={`${imageUrl}`}
            alt="Превью видео"
            className="card-film__preview"
          />
          <ul className="card-film__rubric-list">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Rubric title={tag.name} />
              </li>
            ))}
          </ul>
        </button>
      </div>

      <div className="card-film__video-info">
        <div className="card-film__title-wrap">
          <h2 className="section-title card-film__title">{title}</h2>
          <p className="caption card-film__info">{info}</p>
        </div>
        <button
          type="button"
          className="link card-film__button"
          href={link}
          onClick={handleClick}
        >
          смотреть трейлер
        </button>
      </div>
    </article>
  );
}

CardFilm.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
  link: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  handleClick: PropTypes.func
};

CardFilm.defaultProps = {
  imageUrl: '',
  title: '',
  info: '',
  link: '',
  tags: [],
  handleClick: undefined
};

export default CardFilm;
