import './DropDownSelect.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';

function DropDownSelect({ placeholder, options, inputName, sectionClass }) {
  const [isOpen, setIsOpen] = useState(false);

  const classNames = ['select', sectionClass].join(' ').trim();
  const classNamesButton = [
    'select__button',
    isOpen ? 'select__button_pressed' : '',
  ]
    .join(' ')
    .trim();
  const classNamesDropDown = [
    'select__dropdown',
    isOpen ? 'select__dropdown_opened' : '',
  ]
    .join(' ')
    .trim();
  const classNamesArrow = [
    'select__arrow',
    isOpen ? 'select__arrow_pressed' : '',
  ]
    .join(' ')
    .trim();

  return (
    <div className={classNames}>
      <button
        className={classNamesButton}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {placeholder}
        <svg
          width="24"
          height="19"
          viewBox="0 0 24 19"
          fill="none"
          className={classNamesArrow}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 7L11.8814 14L19 7" />
        </svg>
      </button>
      <ul className={classNamesDropDown}>
        {options &&
          options.map((option) => (
            <li key={option?.id} className="select__option">
              <label
                htmlFor={`${option?.id}-${option?.name}`}
                className="select__label"
              >
                <input
                  className="select__input"
                  name={inputName}
                  value={option?.id}
                />
                <span className="select__span">{option?.name}</span>
              </label>
            </li>
          ))}
      </ul>
    </div>
  );
}

DropDownSelect.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.any),
  inputName: PropTypes.string,
  sectionClass: PropTypes.string,
};

DropDownSelect.defaultProps = {
  placeholder: '',
  options: [],
  inputName: '',
  sectionClass: '',
};

export default DropDownSelect;
