import './Button.scss';
import PropTypes from 'prop-types';

function Button({
  title, titleSelected, color, isDisabled, onClick, isSelected
}) {
  return (
    <button
      className={`button button_color_${color} ${
        isSelected ? `button_color_${color}_selected` : ''
      }`}
      type="button"
      disabled={isDisabled}
      onClick={onClick}
    >
      {!isSelected ? title : (titleSelected || title)}
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string,
  titleSelected: PropTypes.string,
  color: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool
};

Button.defaultProps = {
  title: '',
  color: 'blue',
  titleSelected: undefined,
  onClick: undefined,
  isDisabled: false,
  isSelected: false
};

export default Button;
