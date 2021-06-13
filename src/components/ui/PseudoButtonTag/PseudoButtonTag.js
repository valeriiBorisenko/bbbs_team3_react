import './PseudoButtonTag.scss';
import PropTypes from 'prop-types';

function PseudoButtonTag({
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
        onChange={() => {}}
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

PseudoButtonTag.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  title: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func
};

PseudoButtonTag.defaultProps = {
  type: 'radio',
  name: '',
  value: '',
  title: '',
  isActive: false,
  onClick: () => {}
};

export default PseudoButtonTag;
