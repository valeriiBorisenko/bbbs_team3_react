import './Input.scss';
import PropTypes from 'prop-types';

function Input({
  type, name, placeholder, isRequred, sectionClass, isTextarea
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
        required={isRequred}
      />
    );
  }

  return (
    <input
      className={classNamesInput}
      type={type}
      name={name}
      placeholder={placeholder}
      required={isRequred}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  isRequred: PropTypes.bool,
  sectionClass: PropTypes.string,
  isTextarea: PropTypes.bool
};

Input.defaultProps = {
  type: 'text',
  name: 'default',
  placeholder: '',
  isRequred: false,
  sectionClass: '',
  isTextarea: false
};

export default Input;
