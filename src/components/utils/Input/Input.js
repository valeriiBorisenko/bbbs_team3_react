import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Input.scss';

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

  const classNames = {
    main: refineClassNames(['input-wrap', sectionClass]),
    input: refineClassNames(['input', error ? 'input__error' : '']),
    textarea: refineClassNames([
      'input',
      error ? 'input__error' : '',
      'textarea',
    ]),
  };

  if (isTextarea) {
    return (
      <label className={classNames.main} htmlFor={id}>
        <textarea
          id={id}
          className={classNames.textarea}
          name={name}
          placeholder={errorMessage || placeholder}
          onFocus={onFocus}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
        />
        {error && <span className="input__error-message">{error}</span>}
      </label>
    );
  }

  return (
    <label className={classNames.main} htmlFor={id}>
      <input
        id={id}
        className={classNames.input}
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
  max: PropTypes.number,
  min: PropTypes.number,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  pattern: PropTypes.string,
  error: PropTypes.string,
  onFocus: PropTypes.func,
};

Input.defaultProps = {
  placeholder: '',
  value: '',
  sectionClass: '',
  isTextarea: false,
  onChange: undefined,
  required: false,
  max: undefined,
  min: undefined,
  maxLength: undefined,
  minLength: undefined,
  pattern: undefined,
  error: undefined,
  onFocus: undefined,
};

export default Input;
