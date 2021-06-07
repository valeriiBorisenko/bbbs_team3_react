import './PseudoButtonCheckbox.scss';
import PropTypes from 'prop-types';

function PseudoButtonCheckbox({
  type,
  name,
  value,
  title,
  filters,
  onChange,
  onClick
}) {
  const handleChange = (evt) => {
    onChange(evt, filters);
  };

  const handleClick = (evt) => {
    onClick(evt, value);
  };

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
        onChange={handleChange}
        onClick={handleClick}
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
  filters: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

PseudoButtonCheckbox.defaultProps = {
  type: 'radio',
  name: '',
  value: '',
  title: '',
  filters: {}
};

export default PseudoButtonCheckbox;
