import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Button.scss';

function Button({
  title,
  titleSelected,
  color,
  isSubmittable,
  isDisabled,
  onClick,
  isBooked,
  sectionClass,
}) {
  const classNames = {
    main: refineClassNames([
      'button',
      `button_color_${color}`,
      sectionClass,
      isBooked ? `button_color_${color}_selected` : '',
    ]),
  };

  return (
    <button
      className={classNames.main}
      type={isSubmittable ? 'submit' : 'button'}
      disabled={isDisabled}
      onClick={onClick}
    >
      {!isBooked ? title : titleSelected || title}
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
  isBooked: PropTypes.bool,
  sectionClass: PropTypes.string,
};

Button.defaultProps = {
  title: '',
  color: 'blue',
  isSubmittable: false,
  titleSelected: undefined,
  onClick: undefined,
  isDisabled: false,
  isBooked: false,
  sectionClass: '',
};

export default Button;
