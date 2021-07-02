import './CardArticleBig.scss';
import PropTypes from 'prop-types';
import TitleH3 from '../../utils/TitleH3/TitleH3';
import Card from '../../utils/Card/Card';

function CardArticleBig({ title, color }) {
  return (
    <Card sectionClass="card-article" color={color}>
      <TitleH3 sectionClass="card-article__title" title={title} />
      <span className="link card-article__link">читать статью</span>
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
