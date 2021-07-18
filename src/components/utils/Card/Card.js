import './Card.scss';
import PropTypes from 'prop-types';

function Card({ color, sectionClass, children }) {
  const classNames = ['card', `card_color_${color}`, sectionClass]
    .join(' ')
    .trim();

  return <div className={classNames}>{children}</div>;
}

Card.propTypes = {
  color: PropTypes.string,
  sectionClass: PropTypes.string,
  children: PropTypes.node,
};

Card.defaultProps = {
  color: 'white',
  sectionClass: '',
  children: null,
};

export default Card;
