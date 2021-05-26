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
  sectionClass,
  data
}) {
  function handleClickButtonConfirm() {
    onClick(data);
  }

  return (
    <button
      className={`button button_color_${color} ${sectionClass} ${
        isSelected ? `button_color_${color}_selected` : ''
      }`}
      type={isSubmittable ? 'submit' : 'button'}
      disabled={isDisabled}
      onClick={handleClickButtonConfirm}
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
  sectionClass: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any)
};

Button.defaultProps = {
  title: '',
  color: 'blue',
  isSubmittable: false,
  titleSelected: undefined,
  onClick: undefined,
  isDisabled: false,
  isSelected: false,
  sectionClass: '',
  data: {}
};

export default Button;
