import './CardFigure.scss';
import PropTypes from 'prop-types';

function CardFigure({
  title, shape, color, children, className
}) {
  return (
    <div className={`card-figure card-figure_color_${color} card-figure_form_${shape} ${className}`}>
      <h2 className="section-title">{title}</h2>
      { children }
    </div>
  );
}

CardFigure.propTypes = {
  title: PropTypes.string,
  shape: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

CardFigure.defaultProps = {
  title: '',
  shape: 'square',
  color: 'yellow',
  children: null,
  className: ''
};

export default CardFigure;
