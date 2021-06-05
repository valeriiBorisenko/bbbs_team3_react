import './ButtonRound.scss';
import PropTypes from 'prop-types';

function ButtonRound({
  label,
  name,
  color,
  onClick,
  isClick
}) {
  return (
    <button
      className={`button-round button-round_color_${color} button-round__${name} ${isClick ? `button__${name}_active` : ''}`}
      type="button"
      onClick={onClick}
      aria-label={label}
    />
  );
}

ButtonRound.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  isClick: PropTypes.bool
};

ButtonRound.defaultProps = {
  label: '',
  name: '',
  color: '',
  onClick: undefined,
  isClick: false
};

export default ButtonRound;
