import './Input.scss';
import PropTypes from 'prop-types';

function Input({
  type, name, placeholder, required, sectionClass, isTextarea
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
  required: PropTypes.bool
};

Input.defaultProps = {
  placeholder: '',
  sectionClass: '',
  isTextarea: false,
  required: false
};

export default Input;
