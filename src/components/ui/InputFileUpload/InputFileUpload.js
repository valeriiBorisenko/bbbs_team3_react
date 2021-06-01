/* eslint-disable jsx-a11y/label-has-associated-control */
import './InputFileUpload.scss';
import PropTypes from 'prop-types';

function InputFileUpload({ sectionClass }) {
  const classNames = ['input-file-upload', sectionClass].join(' ').trim();

  return (
    <label className={classNames}>
      <input className="input-file-upload__input" type="file" />
      <span className="input-file-upload__pseudo-button" />
    </label>
  );
}

InputFileUpload.propTypes = {
  sectionClass: PropTypes.string
};

InputFileUpload.defaultProps = {
  sectionClass: ''
};

export default InputFileUpload;
