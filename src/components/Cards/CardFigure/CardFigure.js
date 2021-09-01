import './CardFigure.scss';
import PropTypes from 'prop-types';

function CardFigure({ title, shape, color, children, sectionClass }) {
  return (
    <div
      className={`card-figure card-figure_color_${color} card-figure_form_${shape} ${sectionClass}`}
    >
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </div>
  );
}

CardFigure.propTypes = {
  title: PropTypes.string,
  shape: PropTypes.string.isRequired,
  color: PropTypes.string,
  children: PropTypes.node,
  sectionClass: PropTypes.string,
};

CardFigure.defaultProps = {
  title: '',
  color: 'yellow',
  children: null,
  sectionClass: '',
};

export default CardFigure;
