/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import './PseudoButtonCheckbox.scss';
import PropTypes from 'prop-types';
// import { useState, useRef } from 'react';

function PseudoButtonCheckbox({
  type,
  name,
  value,
  title,
  valueNumber,
  filters,
  onFiltration,
  isFiltersUsed,
  onChange,
  onClick
}) {
  // let state = false;
  // const ref = useRef();
  // console.log(isFiltersUsed);
  // const [isChecked, setChecked] = useState(false);

  // function handleChange(evt) {
  //   console.log(evt);
  //   setChecked(!isChecked);
  //   onFiltration(filters, !isChecked);

  //   // console.log(ref.current);
  //   // state = true;
  //   // console.log(isFiltersUsed);
  //   // if (isChecked === true && isFiltersUsed) {
  //   //   onFiltation(filters, isChecked);
  //   // }
  // }

  // function handleClick(evt) {
  //   const { target } = evt;
  //   console.log(target.checked);
  //   if (target.checked && Number(target.dataset.filter) === filters.monthNumber) {
  //     setChecked(false);
  //     target.checked = false;
  //     console.log(target.checked);
  //   }
  // }

  // if (!isFiltersUsed && isChecked) {
  //   console.log('tyt');
  //   setChecked(false);
  // }

  const handleChange = (evt) => {
    onChange(evt, filters);
  };

  const handleClick = (evt) => {
    onClick(evt, valueNumber);
  };

  return (
    <label
      className="pseudo-button-label"
      // onChange={handleClickButton}
      // onKeyDown={handleClickButton}
    >
      <input
        className="pseudo-button-checkbox"
        type={type}
        name={name}
        value={value}
        valueAsNumber={valueNumber}
        // data-filter={dataFilter}
        // checked={state}
        // ref={ref}
        onChange={handleChange}
        onClick={handleClick}
        // onKeyDown={handleClickButton}
      />
      <span
        // tabIndex={0}
        // role="button"
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
  isFiltersUsed: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  valueNumber: PropTypes.number.isRequired
  // dataFilter: PropTypes.string
};

PseudoButtonCheckbox.defaultProps = {
  type: 'radio',
  name: '',
  value: '',
  title: '',
  onFiltration: undefined,
  filters: {},
  isFiltersUsed: false
  // dataFilter: ''
};

export default PseudoButtonCheckbox;
