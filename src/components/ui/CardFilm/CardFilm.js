import './CardFilm.scss';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';
import TitleH2 from '../TitleH2/TitleH2';
import Card from '../Card/Card';

function CardFilm({
  data: {
    imageUrl, title, info, link, tags
  }, handleClick
}) {
  return (
    <Card sectionClass="card-film">
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
                <Rubric title={tag.name} sectionClass="card-film__rubric" />
              </li>
            ))}
          </ul>
        </button>
      </div>

      <div className="card-film__video-info">
        <div className="card-film__title-wrap">
          <TitleH2 sectionClass="card-film__title" title={title} />
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
    </Card>
  );
}

CardFilm.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
  link: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  handleClick: PropTypes.func
};

CardFilm.defaultProps = {
  data: {},
  imageUrl: '',
  title: '',
  info: '',
  link: '',
  tags: [],
  handleClick: () => {}
};

export default CardFilm;
