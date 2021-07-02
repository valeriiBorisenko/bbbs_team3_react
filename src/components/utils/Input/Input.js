/* eslint-disable react/jsx-props-no-spreading */
import './Input.scss';
import PropTypes from 'prop-types';

function Input({
  type,
  name,
  placeholder,
  register,
  required,
  max,
  min,
  minLength,
  maxLength,
  pattern,
  error,
  errorMessage,
  sectionClass,
  isTextarea,
  onFocus,
}) {
  const message = error ? errorMessage : '';

  const classNamesInput = ['input', message ? 'input__error' : '', sectionClass]
    .join(' ')
    .trim();
  const classNamesTextarea = [
    'input',
    message ? 'input__error' : '',
    'textarea',
    sectionClass,
  ]
    .join(' ')
    .trim();

  if (isTextarea) {
    return (
      <textarea
        className={classNamesTextarea}
        type={type}
        name={name}
        placeholder={message || placeholder}
        {...register(name, { required, minLength, maxLength })}
      />
    );
  }

  return (
    <input
      className={classNamesInput}
      type={type}
      name={name}
      placeholder={message || placeholder}
      onFocus={onFocus}
      {...register(name, { required, max, min, minLength, maxLength, pattern })}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  sectionClass: PropTypes.string,
  isTextarea: PropTypes.bool,
  onChange: PropTypes.func,
  register: PropTypes.func.isRequired,
  required: PropTypes.bool,
  max: PropTypes.objectOf(PropTypes.any),
  min: PropTypes.objectOf(PropTypes.any),
  maxLength: PropTypes.objectOf(PropTypes.any),
  minLength: PropTypes.objectOf(PropTypes.any),
  pattern: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  errorMessage: PropTypes.string,
  onFocus: PropTypes.func,
};

Input.defaultProps = {
  placeholder: '',
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
  errorMessage: '',
  onFocus: () => {},
};

export default Input;
