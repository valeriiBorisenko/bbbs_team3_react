import './CardAnnotation.scss';
import PropTypes from 'prop-types';
import Caption from '../Caption/Caption';

function CardAnnotationContainer({ caption, children }) {
  return (
    <div className="card-annotation__content">
      {caption && <Caption sectionClass="card-annotation__caption" title={caption} />}

      <div className="card-annotation__desc">
        {children}
      </div>
    </div>
  );
}

CardAnnotationContainer.propTypes = {
  caption: PropTypes.string,
  children: PropTypes.node
};

CardAnnotationContainer.defaultProps = {
  caption: false,
  children: null
};

export default CardAnnotationContainer;
