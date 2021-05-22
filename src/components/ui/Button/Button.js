import './Button.scss';
import PropTypes from 'prop-types';

function Button({
  title, titleSelected, color, isSelected, isDisabled, handleClick
}) {
  return (
    <button
      className={`button button_color_${color} ${
        isSelected ? `button_color_${color}_selected` : ''
      }`}
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
    >
      {!isSelected ? title : (titleSelected || title)}
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string,
  titleSelected: PropTypes.string,
  color: PropTypes.string,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  handleClick: PropTypes.func
};

Button.defaultProps = {
  title: '',
  color: 'blue',
  titleSelected: undefined,
  isSelected: false,
  isDisabled: false,
  handleClick: undefined
};

export default Button;
