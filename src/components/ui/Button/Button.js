import './Button.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';

function Button({
  title, titleSelected, color, isDisabled, onClick
}) {
  const [isSelected, setIsISelectedMouth] = useState(false);
  const handleClickMouth = () => {
    if (isSelected) setIsISelectedMouth(false);
    else setIsISelectedMouth(true);
  };

  const handleClickButton = () => {
    if (onClick !== undefined) {
      onClick();
      handleClickMouth();
    } else handleClickMouth();
  };

  return (
    <button
      className={`button button_color_${color} ${
        isSelected ? `button_color_${color}_selected` : ''
      }`}
      type="button"
      disabled={isDisabled}
      onClick={handleClickButton}
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
  onClick: PropTypes.func
};

Button.defaultProps = {
  title: '',
  color: 'blue',
  titleSelected: undefined,
  onClick: undefined,
  isDisabled: false
};

export default Button;
