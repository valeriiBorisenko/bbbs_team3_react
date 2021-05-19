import './Button.scss';
import PropTypes from 'prop-types';

function Button({
  title, titleSelected, color, isSelected, isDisabled, onClick
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
      {/* если не нужно делать выделение для кнопки, то пропс titleSelected
       не передаётся, на его место встает пропс title */}
      {!isSelected ? title : (titleSelected || title)}
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  titleSelected: PropTypes.string,
  color: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func
};

Button.defaultProps = {
  titleSelected: undefined,
  isSelected: false,
  isDisabled: false,
  onClick: undefined
};

export default Button;