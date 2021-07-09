/* eslint-disable react/jsx-props-no-spreading */
import './DropDownSelect.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function DropDownSelect({
  placeholder,
  options,
  inputName,
  error,
  register,
  sectionClass,
  isFormOpen,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState(null);

  const classNames = ['select', sectionClass].join(' ').trim();
  const classNamesButton = [
    'select__button',
    isOpen ? 'select__button_pressed' : '',
    optionSelected ? 'select__button_selected' : '',
    error ? 'select__button_error' : '',
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
    error ? 'select__arrow_error' : '',
  ]
    .join(' ')
    .trim();

  useEffect(() => {
    if (isFormOpen) {
      setOptionSelected(null);
      setIsOpen(false);
    }
  }, [isFormOpen]);

  return (
    <div className={classNames}>
      <button
        className={classNamesButton}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {optionSelected || placeholder}
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
                  id={`${option?.id}-${option?.name}`}
                  className="select__input"
                  type="radio"
                  name={inputName}
                  value={option?.id}
                  onClick={() => {
                    setOptionSelected(option?.name);
                    setIsOpen(!isOpen);
                  }}
                  {...register(inputName, { required: placeholder })}
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
  error: PropTypes.objectOf(PropTypes.any),
  register: PropTypes.func.isRequired,
  sectionClass: PropTypes.string,
  isFormOpen: PropTypes.bool,
};

DropDownSelect.defaultProps = {
  placeholder: '',
  options: [],
  inputName: '',
  error: undefined,
  sectionClass: '',
  isFormOpen: false,
};

export default DropDownSelect;
