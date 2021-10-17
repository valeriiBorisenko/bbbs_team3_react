import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import { Card, Paragraph } from '../../utils';
import CardAnnotationContainer from './CardAnnotationContainer';
import './CardAnnotation.scss';

function CardAnnotation({ info, description, isMain, sectionClass }) {
  const classNames = {
    main: refineClassNames([
      'card-annotation',
      isMain ? 'card-annotation_main' : '',
      info && isMain ? '' : 'card-annotation_main_center',
      sectionClass,
    ]),
  };

  return (
    <Card sectionClass={classNames.main}>
      <CardAnnotationContainer caption={info}>
        <Paragraph content={description} />
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
