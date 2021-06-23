import './Card.scss';
import PropTypes from 'prop-types';

function Card({ color, sectionClass, children, onClick }) {
  const classNames = ['card', `card_color_${color}`, sectionClass]
    .join(' ')
    .trim();

  return (
    <div
      className={classNames}
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex="0"
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  color: PropTypes.string,
  sectionClass: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  color: 'white',
  sectionClass: '',
  children: null,
  onClick: () => {},
};

export default Card;
