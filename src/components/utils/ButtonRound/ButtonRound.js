import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './ButtonRound.scss';

function ButtonRound({
  label,
  sectionClass,
  color,
  isSmall,
  isDisabled,
  isSpan,
  onClick,
  isClick,
}) {
  const classNames = {
    main: refineClassNames([
      'button-round',
      `button-round_color_${color}`,
      isSmall ? 'button-round_small' : '',
      sectionClass,
      isClick ? 'button-round_active' : '',
    ]),
  };

  if (isSpan) {
    return <span className={classNames.main} />;
  }

  return (
    <button
      className={classNames.main}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
    />
  );
}

ButtonRound.propTypes = {
  label: PropTypes.string,
  sectionClass: PropTypes.string,
  color: PropTypes.string,
  isSmall: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSpan: PropTypes.bool,
  onClick: PropTypes.func,
  isClick: PropTypes.bool,
};

ButtonRound.defaultProps = {
  label: '',
  sectionClass: '',
  color: '',
  isSmall: false,
  isDisabled: false,
  isSpan: false,
  onClick: undefined,
  isClick: false,
};

export default ButtonRound;
