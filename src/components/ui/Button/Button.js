import './Button.scss';
import PropTypes from 'prop-types';

// кнопка находится в 2-х состояниях: обычное и по типу чекбокса (пропс isSelected)
// для обычной кнопки пропсы isSelected и titleSelected не передаются
// пропс titleSelected отвечает за изменение текста выделенной кнопки
// если не нужно делать выделение для кнопки, то пропс titleSelected не передаётся,
// на его место встает пропс title
// по умолчанию кнопка активна, на неё можно кликнуть

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
  onClick: PropTypes.func.isRequired
};

Button.defaultProps = {
  titleSelected: undefined,
  isSelected: false,
  isDisabled: false
};

export default Button;
