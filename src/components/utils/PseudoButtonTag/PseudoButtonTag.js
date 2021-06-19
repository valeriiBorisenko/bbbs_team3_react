import './PseudoButtonTag.scss';
import PropTypes from 'prop-types';
import { useRef } from 'react';

function PseudoButtonTag({
  type,
  name,
  value,
  title,
  isActive,
  onClick
}) {
  const id = `filter-button-${value}`;

  const ref = useRef();

  function handleClick(event) {
    console.log('event.target.checked', event.target.checked); // false
    console.log(event.target.checked); // false
    console.dir(event.target.checked); // TRUE!!!!!!!
    console.dir(ref.current); // TRUE!!!!!!!
    // onClick(value, !isActive); // с этим все работает!
    onClick(value, event.target.checked);
    // или это onClick(value, event.target.checked); , но
    // тогда надо в changeRadioTagState менять filterItem.isActive = !isChecked;
  }
  console.log(`${title}`, isActive);
  return (
    <label
      className="pseudo-button-label"
      htmlFor={id}
    >
      <input
        ref={ref}
        id={id}
        className="pseudo-button-checkbox"
        type={type}
        name={name}
        value={value}
        checked={isActive}
        onChange={() => {}}
        onClick={handleClick}
      />
      <span
        // className={`button pseudo-button ${isActive ? 'active-filter' : ''}`}
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
