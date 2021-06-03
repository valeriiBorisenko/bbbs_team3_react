import './InputFileUpload.scss';
import PropTypes from 'prop-types';

function InputFileUpload({
  name, sectionClass, onChange
}) {
  const classNames = ['input-file-upload', sectionClass].join(' ').trim();

  const handleChange = (evt) => {
    onChange(evt);
  };

  return (
    <label htmlFor={`input-file-upload-${name}`} className={classNames}>
      <input
        id={`input-file-upload-${name}`}
        className="input-file-upload__input"
        type="file"
        name={name}
        onChange={handleChange}
      />
      <span className="input-file-upload__pseudo-button" />
    </label>
  );
}

InputFileUpload.propTypes = {
  name: PropTypes.string.isRequired,
  sectionClass: PropTypes.string,
  onChange: PropTypes.func
};

InputFileUpload.defaultProps = {
  sectionClass: '',
  onChange: undefined
};

export default InputFileUpload;
