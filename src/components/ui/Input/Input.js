/* eslint-disable react/jsx-props-no-spreading */
import './Input.scss';
import PropTypes from 'prop-types';

function Input({
  type,
  name,
  placeholder,
  register,
  minLength,
  maxLength,
  required,
  sectionClass,
  isTextarea
}) {
  const classNamesInput = ['input', sectionClass].join(' ').trim();
  const classNamesTextarea = ['input', 'textarea', sectionClass].join(' ').trim();

  if (isTextarea) {
    return (
      <textarea
        className={classNamesTextarea}
        type={type}
        name={name}
        placeholder={placeholder}
        {...register(name, { required, minLength, maxLength })}
      />
    );
  }

  return (
    <input
      className={classNamesInput}
      type={type}
      name={name}
      placeholder={placeholder}
      {...register(name, { required, minLength, maxLength })}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  sectionClass: PropTypes.string,
  isTextarea: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  register: PropTypes.func.isRequired,
  minLength: PropTypes.string,
  maxLength: PropTypes.string
};

Input.defaultProps = {
  placeholder: '',
  sectionClass: '',
  isTextarea: false,
  required: false,
  onChange: undefined,
  value: '',
  minLength: undefined,
  maxLength: undefined
};

export default Input;
