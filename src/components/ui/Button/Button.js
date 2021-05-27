import './Button.scss';
import PropTypes from 'prop-types';

function Button({
  title,
  titleSelected,
  color,
  isSubmittable,
  isDisabled,
  onClick,
  isSelected,
  sectionClass
}) {
  return (
    <button
      className={`button button_color_${color} ${sectionClass} ${
        isSelected ? `button_color_${color}_selected` : ''
      }`}
      type={isSubmittable ? 'submit' : 'button'}
      disabled={isDisabled}
      onClick={onClick}
    >
      {!isSelected ? title : titleSelected || title}
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string,
  titleSelected: PropTypes.string,
  color: PropTypes.string,
  isSubmittable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  sectionClass: PropTypes.string
};

Button.defaultProps = {
  title: '',
  color: 'blue',
  isSubmittable: false,
  titleSelected: undefined,
  onClick: undefined,
  isDisabled: false,
  isSelected: false,
  sectionClass: ''
};

export default Button;
