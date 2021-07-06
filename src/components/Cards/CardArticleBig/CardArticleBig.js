import './CardArticleBig.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, TitleH3 } from '../../utils/index';

function CardArticleBig({ title, color }) {
  return (
    <Card sectionClass="card-article" color={color}>
      <TitleH3 sectionClass="card-article__title" title={title} />
      <span className="link card-article__link">{texts.linkText}</span>
    </Card>
  );
}

CardArticleBig.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
};

CardArticleBig.defaultProps = {
  color: 'white',
  title: '',
};

export default CardArticleBig;
