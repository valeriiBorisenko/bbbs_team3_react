import PropTypes from 'prop-types';

function PseudoButtonCheckbox({
  type,
  name,
  value,
  title,
  isActive,
  onClick
}) {
  const id = `filter-button-${value}`;
  return (
    <label
      className="pseudo-button-label"
      htmlFor={id}
    >
      <input
        id={id}
        className="pseudo-button-checkbox"
        type={type}
        name={name}
        value={value}
        checked={isActive}
        onClick={(evt) => onClick(value, evt.target.checked)}
      />
      <span
        className="button pseudo-button"
      >
        {title}
      </span>
    </label>
  );
}

PseudoButtonCheckbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  title: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

PseudoButtonCheckbox.defaultProps = {
  type: 'radio',
  name: '',
  value: '',
  title: '',
  isActive: false
};

export default PseudoButtonCheckbox;
