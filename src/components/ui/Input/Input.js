import './Input.scss';
import PropTypes from 'prop-types';

function Input({
  type, name, placeholder, required, sectionClass, isTextarea, onChange, value
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
        onChange={onChange}
        value={value}
        required={required}
      />
    );
  }

  return (
    <input
      className={classNamesInput}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      required={required}
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
  value: PropTypes.string
};

Input.defaultProps = {
  placeholder: '',
  sectionClass: '',
  isTextarea: false,
  required: false,
  onChange: undefined,
  value: ''
};

export default Input;
