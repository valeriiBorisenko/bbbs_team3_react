import './CardAnnotation.scss';
import PropTypes from 'prop-types';

// info не обязателен
// isChosen отвечает за то, будет ли компонент рядом с главной карточкой места (отличаются отступы)

function CardAnnotation({
  isChosen, info, description
}) {
  return (
    <div
      className={`card-annotation ${isChosen ? 'card-annotation_main' : ''}`}
    >
      <div className="card-annotation__content">
        {info && <p className="caption">{info}</p>}

        <div
          className={`card-annotation__desc ${
            info && isChosen ? 'card-annotation__desc_main' : ''
          }`}
        >
          <p className="paragraph card-annotation__paragraph">{description}</p>
        </div>
      </div>
    </div>
  );
}

CardAnnotation.propTypes = {
  info: PropTypes.string,
  description: PropTypes.string,
  isChosen: PropTypes.bool
};

CardAnnotation.defaultProps = {
  info: undefined,
  description: undefined,
  isChosen: false
};

export default CardAnnotation;
