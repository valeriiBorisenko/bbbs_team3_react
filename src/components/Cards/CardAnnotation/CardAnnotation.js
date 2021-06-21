import './CardAnnotation.scss';
import PropTypes from 'prop-types';
import Card from '../../utils/Card/Card';
import CardAnnotationContainer from './CardAnnotationContainer';

function CardAnnotation({ info, description, isMain }) {
  return (
    <Card
      sectionClass={`card-annotation ${isMain ? 'card-annotation_main' : ''}`}
    >
      <CardAnnotationContainer caption={info}>
        <p className="paragraph card-annotation__paragraph">{description}</p>
      </CardAnnotationContainer>
    </Card>
  );
}

CardAnnotation.propTypes = {
  info: PropTypes.string,
  description: PropTypes.string,
  isMain: PropTypes.bool,
};

CardAnnotation.defaultProps = {
  info: undefined,
  description: undefined,
  isMain: false,
};

export default CardAnnotation;
