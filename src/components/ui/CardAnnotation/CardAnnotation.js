import './CardAnnotation.scss';
import PropTypes from 'prop-types';

function CardAnnotation({
  info, description, mix
}) {
  return (
    <div
      className={`card-annotation ${mix}`}
    >
      <div className="card-annotation__content">

        {info && <p className="caption">{info}</p>}

        <div className="card-annotation__desc">
          <p className="paragraph card-annotation__paragraph">{description}</p>
        </div>
      </div>
    </div>
  );
}

CardAnnotation.propTypes = {
  info: PropTypes.string,
  description: PropTypes.string,
  mix: PropTypes.string
};

CardAnnotation.defaultProps = {
  info: undefined,
  description: undefined,
  mix: ''
};

export default CardAnnotation;
