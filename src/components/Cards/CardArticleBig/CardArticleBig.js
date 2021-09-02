import './CardArticleBig.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, TitleH3 } from '../../utils/index';

function CardArticleBig({ title, color, articleUrl }) {
  return (
    <Card sectionClass="card-article" color={color}>
      <a
        href={articleUrl}
        className="card-article__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TitleH3 sectionClass="card-article__title" title={title} />
      </a>
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
};

CardArticleBig.defaultProps = {
  color: 'white',
  title: '',
  articleUrl: '#',
};

export default CardArticleBig;
