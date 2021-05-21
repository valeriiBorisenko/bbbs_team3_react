import './CardAnnotation.scss';
import PropTypes from 'prop-types';

// карточка по типу аннотации с вертикальным скроллом
// пустая для добавления множественных элементов со своими стилями через пропс children

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
