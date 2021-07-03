import PropTypes from 'prop-types';
import './CardBook.scss';
import { Card, TitleH2 } from './index';

function CardBook({
  data: {
    title,
    type: { color },
    url,
  },
}) {
  const backgroundColor = { backgroundColor: color };

  return (
    <Card sectionClass="card-book">
      <a
        className="card-book__cover"
        style={backgroundColor}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TitleH2 sectionClass="card-book__title" title={title} />
        <div className="card-book__info">
          <div className="card-book__border" />
          <p className="caption card-book__text">
            Переполнение текстом Переполнение текстом Переполнениетекстом
            Переполнение текстом Переполнение текстом Переполнение текстом
          </p>
          <p className="caption card-book__text">2020</p>
        </div>
      </a>
    </Card>
  );
}
CardBook.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  type: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  url: PropTypes.string,
};

CardBook.defaultProps = {
  data: {},
  type: {},
  title: '',
  url: '',
};

export default CardBook;
