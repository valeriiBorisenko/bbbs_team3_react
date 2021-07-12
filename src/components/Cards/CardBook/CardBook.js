import './CardBook.scss';
import PropTypes from 'prop-types';
import { Card, TitleH2 } from '../../utils/index';
import CardAnnotation from '../CardAnnotation/CardAnnotation';

function CardBook({
  data: {
    title,
    author,
    year,
    type: { color },
    url,
    annotation,
  },
}) {
  const backgroundColor = { backgroundColor: color };

  return (
    <article className="card-container">
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
            <p className="caption card-book__text">{author}</p>
            <p className="caption card-book__text">{year}</p>
          </div>
        </a>
      </Card>
      <CardAnnotation description={annotation} />
    </article>
  );
}
CardBook.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  type: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  author: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  url: PropTypes.string,
  annotation: PropTypes.string,
};

CardBook.defaultProps = {
  data: {},
  type: {},
  title: '',
  author: '',
  year: '',
  url: '',
  annotation: '',
};

export default CardBook;
