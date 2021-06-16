import './ButtonRound.scss';
import PropTypes from 'prop-types';

function ButtonRound({
  label,
  sectionClass,
  color,
  isSmall,
  isDisabled,
  onClick,
  isClick
}) {
  const classNames = [
    'button-round',
    `button-round_color_${color}`,
    isSmall ? 'button-round_small' : '',
    sectionClass,
    isClick ? 'button-round_active' : ''
  ].join(' ').trim();

  return (
    <button
      className={classNames}
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
  onClick: PropTypes.func,
  isClick: PropTypes.bool
};

ButtonRound.defaultProps = {
  label: '',
  sectionClass: '',
  color: '',
  isSmall: false,
  isDisabled: false,
  onClick: undefined,
  isClick: false
};

export default ButtonRound;
