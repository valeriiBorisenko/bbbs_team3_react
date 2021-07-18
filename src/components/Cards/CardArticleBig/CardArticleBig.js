import './CardArticleBig.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import texts from './locales/RU';
import { Card, TitleH3 } from '../../utils/index';

function CardArticleBig({ title, color, articleUrl, pageUrl }) {
  return (
    <Card sectionClass="card-article" color={color}>
      <Link to={pageUrl} className="card-article__link">
        <TitleH3 sectionClass="card-article__title" title={title} />
      </Link>
      <a
        className="link card-article__link"
        href={articleUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {texts.linkText}
      </a>
    </Card>
  );
}

CardArticleBig.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  articleUrl: PropTypes.string,
  pageUrl: PropTypes.string,
};

CardArticleBig.defaultProps = {
  color: 'white',
  title: '',
  articleUrl: '#',
  pageUrl: '/',
};

export default CardArticleBig;
