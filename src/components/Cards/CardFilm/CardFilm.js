import './CardFilm.scss';
import PropTypes from 'prop-types';
import { TitleH2, Card, Caption } from './index';
import { changeCaseOfFirstLetter } from '../../../utils/utils';

const BASE_MEDIA_URL = 'http://127.0.0.1/media';

function CardFilm({ data, handleClick, children }) {
  const { image, title, info, link } = data;
  return (
    <Card sectionClass="card-film">
      <div className="card-film__video">
        <button
          className="card-film__button"
          type="button"
          onClick={handleClick}
        >
          <img
            src={`${BASE_MEDIA_URL}${image}`}
            alt="Превью видео"
            className="card-film__preview"
          />
          {children}
        </button>
      </div>

      <div className="card-film__video-info">
        <div className="card-film__title-wrap">
          <TitleH2
            sectionClass="card-film__title"
            title={changeCaseOfFirstLetter(title)}
          />
          <Caption
            sectionClass="card-film__info"
            title={changeCaseOfFirstLetter(info)}
          />
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
  handleClick: PropTypes.func,
  children: PropTypes.node,
};

CardFilm.defaultProps = {
  data: {},
  handleClick: () => {},
  children: null,
};

export default CardFilm;
