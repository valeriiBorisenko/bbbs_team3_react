/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import './PseudoButtonCheckbox.scss';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';

function PseudoButtonCheckbox({
  type,
  name,
  value,
  title,
  filters,
  onFiltration,
  isFiltersUsed
}) {
  let state = false;
  const ref = useRef();
  console.log(isFiltersUsed);
  const [isChecked, setChecked] = useState(false);

  function handleClickButton() {
    setChecked(!isChecked);
    console.log(ref.current);
    state = true;
    // console.log(isFiltersUsed);
    // if (isChecked === true && isFiltersUsed) {
    //   onFiltation(filters, isChecked);
    // }
    // onFiltration(filters, !isChecked);
  }

  // if (!isFiltersUsed && isChecked) {
  //   console.log('tyt');
  //   setChecked(false);
  // }

  return (
    <label
      className="pseudo-button-label"
      onChange={handleClickButton}
      onKeyDown={handleClickButton}
    >
      <input
        className="pseudo-button-checkbox"
        type={type}
        name={name}
        value={value}
        checked={state}
        ref={ref}
        // onChange={handleClickButton}
        // onKeyDown={handleClickButton}
      />
      <span
        tabIndex={0}
        role="button"
        // onChange={handleClickButton}
        // onKeyDown={handleClickButton}
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
  filters: PropTypes.objectOf(PropTypes.number),
  onFiltration: PropTypes.func,
  isFiltersUsed: PropTypes.bool
};

PseudoButtonCheckbox.defaultProps = {
  type: 'radio',
  name: '',
  value: '',
  title: '',
  onFiltration: undefined,
  filters: {},
  isFiltersUsed: false
};

export default PseudoButtonCheckbox;
