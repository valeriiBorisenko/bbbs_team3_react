/* eslint-disable react/jsx-props-no-spreading */
import './Input.scss';
import PropTypes from 'prop-types';

function Input({
  id,
  type,
  name,
  placeholder,
  value,
  required,
  max,
  min,
  minLength,
  maxLength,
  pattern,
  error,
  sectionClass,
  isTextarea,
  onFocus,
  onChange,
}) {
  const errorMessage = error ? `${placeholder}*` : '';

  const classNamesWrap = ['input-wrap', sectionClass].join(' ').trim();

  const classNamesInput = ['input', error ? 'input__error' : '']
    .join(' ')
    .trim();
  const classNamesTextarea = ['input', error ? 'input__error' : '', 'textarea']
    .join(' ')
    .trim();

  if (isTextarea) {
    return (
      <label className={classNamesWrap} htmlFor={id}>
        <textarea
          id={id}
          className={classNamesTextarea}
          type={type}
          name={name}
          placeholder={errorMessage || placeholder}
          onFocus={onFocus}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          required={required}
        />
        {error && <span className="input__error-message">{error}</span>}
      </label>
    );
  }

  return (
    <label className={classNamesWrap} htmlFor={id}>
      <input
        id={id}
        className={classNamesInput}
        type={type}
        name={name}
        placeholder={errorMessage || placeholder}
        onFocus={onFocus}
        onChange={onChange}
        value={value}
        maxLength={maxLength}
        minLength={minLength}
        max={max}
        min={min}
        pattern={pattern}
        required={required}
      />
      {error && <span className="input__error-message">{error}</span>}
    </label>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sectionClass: PropTypes.string,
  isTextarea: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  max: PropTypes.string,
  min: PropTypes.string,
  maxLength: PropTypes.string,
  minLength: PropTypes.string,
  pattern: PropTypes.string,
  error: PropTypes.string,
  onFocus: PropTypes.func,
};

Input.defaultProps = {
  placeholder: '',
  value: '',
  sectionClass: '',
  isTextarea: false,
  onChange: () => {},
  required: false,
  max: undefined,
  min: undefined,
  maxLength: undefined,
  minLength: undefined,
  pattern: undefined,
  error: undefined,
  onFocus: () => {},
};

export default Input;
