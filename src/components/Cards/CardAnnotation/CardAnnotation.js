import './CardAnnotation.scss';
import PropTypes from 'prop-types';
import { Card } from '../../utils/index';
import CardAnnotationContainer from './CardAnnotationContainer';

function CardAnnotation({ info, description, isMain, sectionClass }) {
  const classNames = [
    'card-annotation',
    isMain ? 'card-annotation_main' : '',
    sectionClass,
  ]
    .join(' ')
    .trim();
  return (
    <Card sectionClass={classNames}>
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
  sectionClass: PropTypes.string,
};

CardAnnotation.defaultProps = {
  info: undefined,
  description: undefined,
  isMain: false,
  sectionClass: '',
};

export default CardAnnotation;
