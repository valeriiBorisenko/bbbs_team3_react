import './CardAnnotation.scss';
import PropTypes from 'prop-types';

// description и info не обязательны, если нужно убрать какой-то элемент
// вместо description можно передать children со своими стилями
// isChosen отвечает за то, будет ли компонент рядом с главной карточкой (отличаются отступы)

function CardAnnotation({
  isChosen, info, description, children
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
          {description && (
            <p className="paragraph card-annotation__paragraph">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

CardAnnotation.propTypes = {
  info: PropTypes.string,
  description: PropTypes.string,
  isChosen: PropTypes.bool,
  children: PropTypes.node
};

CardAnnotation.defaultProps = {
  info: undefined,
  description: undefined,
  isChosen: false,
  children: ''
};

export default CardAnnotation;
