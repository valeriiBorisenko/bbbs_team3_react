import './Button.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';

function Button({
  title, titleSelected, color, isDisabled
}) {
  const [isSelected, setiISelected] = useState(false);
  const handleClick = () => {
    if (isSelected) setiISelected(false);
    else setiISelected(true);
  };
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
  isDisabled: PropTypes.bool
};

Button.defaultProps = {
  title: '',
  color: 'blue',
  titleSelected: undefined,
  isDisabled: false
};

export default Button;
