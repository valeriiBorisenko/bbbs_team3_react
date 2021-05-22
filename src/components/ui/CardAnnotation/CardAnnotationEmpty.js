import './CardAnnotation.scss';
import PropTypes from 'prop-types';

function CardAnnotationEmpty({ children }) {
  return (
    <div className="card-annotation">
      <div className="card-annotation__content">
        <div className="card-annotation__desc">{children}</div>
      </div>
    </div>
  );
}

CardAnnotationEmpty.propTypes = {
  children: PropTypes.node.isRequired
};

export default CardAnnotationEmpty;
