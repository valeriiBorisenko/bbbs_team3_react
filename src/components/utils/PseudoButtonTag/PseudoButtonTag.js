import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './PseudoButtonTag.scss';

function PseudoButtonTag({
  name,
  value,
  title,
  isActive,
  onClick,
  sectionClass,
}) {
  const id = `filter-button-${value}`;

  const classNames = {
    main: refineClassNames(['pseudo-button-label', sectionClass]),
  };

  function handleClick(event) {
    onClick(value, event.target.checked);
  }

  return (
    <label className={classNames.main} htmlFor={id}>
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
  onClick: undefined,
  sectionClass: '',
};

export default PseudoButtonTag;
