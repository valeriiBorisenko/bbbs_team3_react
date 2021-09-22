import './PseudoButtonTag.scss';
import PropTypes from 'prop-types';

function PseudoButtonTag({
  name,
  value,
  title,
  isActive,
  onClick,
  sectionClass,
}) {
  const id = `filter-button-${value}`;

  const classNames = ['pseudo-button-label', sectionClass].join(' ').trim();

  function handleClick(event) {
    onClick(value, event.target.checked);
  }

  return (
    <label className={classNames} htmlFor={id}>
      <input
        id={id}
        className="pseudo-button-checkbox"
        type="checkbox"
        name={name}
        value={value}
        checked={isActive}
        onChange={() => {}}
        onClick={handleClick}
      />
      <span className="button pseudo-button">{title}</span>
    </label>
  );
}

PseudoButtonTag.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  sectionClass: PropTypes.string,
};

PseudoButtonTag.defaultProps = {
  name: '',
  value: '',
  title: '',
  isActive: false,
  onClick: () => {},
  sectionClass: '',
};

export default PseudoButtonTag;
