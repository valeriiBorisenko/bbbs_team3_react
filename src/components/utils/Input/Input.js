/* eslint-disable react/jsx-props-no-spreading */
import './Input.scss';
import PropTypes from 'prop-types';

function Input({
  type,
  name,
  placeholder,
  register,
  required,
  error,
  errorMessage,
  sectionClass,
  isTextarea,
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
        {...register(name, { required })}
      />
    );
  }

  return (
    <input
      className={classNamesInput}
      type={type}
      name={name}
      placeholder={message || placeholder}
      {...register(name, { required })}
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
  error: PropTypes.objectOf(PropTypes.any),
  errorMessage: PropTypes.string,
};

Input.defaultProps = {
  placeholder: '',
  sectionClass: '',
  isTextarea: false,
  onChange: () => {},
  required: false,
  error: undefined,
  errorMessage: '',
};

export default Input;
