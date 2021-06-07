import './ButtonDots.scss';
import PropTypes from 'prop-types';

function ButtonDots({ handleClick }) {
  return (
    <button
      className="button-dots"
      type="button"
      onClick={handleClick}
    >
      &#8226;&#8226;&#8226;
    </button>
  );
}

ButtonDots.propTypes = {
  handleClick: PropTypes.func
};

ButtonDots.defaultProps = {
  handleClick: () => {}
};

export default ButtonDots;
