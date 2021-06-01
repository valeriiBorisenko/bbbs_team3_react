import './Button.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';

function ButtonTags({
  title,
  color,
  enableFiltation,
  filters
}) {
  const [isSelected, setSelected] = useState(false);
  function handleClickButton() {
    if (isSelected) {
      setSelected(false);
    } else {
      setSelected(true);
    }

    enableFiltation(filters); //!
  }

  return (
    <button
      className={`button button_color_${color} ${
        isSelected ? `button_color_${color}_selected` : ''
      }`}
      type="button"
      onClick={handleClickButton}
    >
      {title}
    </button>
  );
}

ButtonTags.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  filters: PropTypes.objectOf(PropTypes.number),
  enableFiltation: PropTypes.func
};

ButtonTags.defaultProps = {
  title: '',
  color: 'blue',
  enableFiltation: undefined,
  filters: {}
};

export default ButtonTags;
