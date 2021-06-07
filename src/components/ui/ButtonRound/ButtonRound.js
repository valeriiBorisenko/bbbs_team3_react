import './ButtonRound.scss';
import PropTypes from 'prop-types';

function ButtonRound({
  label,
  sectionClass,
  color,
  onClick,
  isClick
}) {
  const classNames = [
    'button-round',
    `button-round_color_${color}`,
    sectionClass,
    isClick ? 'button-round_active' : ''
  ].join(' ').trim();

  return (
    <button
      className={classNames}
      type="button"
      onClick={onClick}
      aria-label={label}
    />
  );
}

ButtonRound.propTypes = {
  label: PropTypes.string,
  sectionClass: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  isClick: PropTypes.bool
};

ButtonRound.defaultProps = {
  label: '',
  sectionClass: '',
  color: '',
  onClick: undefined,
  isClick: false
};

export default ButtonRound;