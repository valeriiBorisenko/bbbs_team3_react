import './Card.scss';
import PropTypes from 'prop-types';

function Card({ color, sectionClass, children }) {
  return (
    <article className={`card card_color_${color} ${sectionClass}`}>
      {children}
    </article>
  );
}

Card.propTypes = {
  color: PropTypes.string,
  sectionClass: PropTypes.string,
  children: PropTypes.node
};

Card.defaultProps = {
  color: 'white',
  sectionClass: '',
  children: null
};

export default Card;
