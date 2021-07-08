import './CardFilm.scss';
import PropTypes from 'prop-types';
import { TitleH2, Card, Caption } from '../../utils/index';
import { changeCaseOfFirstLetter } from '../../../utils/utils';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';

function CardFilm({ data, onClick, children }) {
  const { image, title, info, link } = data;

  const handleClick = () => onClick(data);

  return (
    <Card sectionClass="card-film">
      <div className="card-film__video">
        <button
          className="card-film__button"
          type="button"
          onClick={handleClick}
        >
          <img
            src={`${staticImageUrl}/${image}`}
            alt={`Превью к видео: ${title}`}
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
          {texts.lintText}
        </button>
      </div>
    </Card>
  );
}

CardFilm.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  children: PropTypes.node,
};

CardFilm.defaultProps = {
  data: {},
  onClick: () => {},
  children: null,
};

export default CardFilm;
