import PropTypes from 'prop-types';

function Blockquote({ sectionWrapperClass, sectionTitleClass, text }) {
  return (
    <blockquote className={sectionWrapperClass}>
      <h3 className={`chapter-title ${sectionTitleClass}`}>
        {text}
      </h3>
    </blockquote>
  );
}

Blockquote.propTypes = {
  sectionWrapperClass: PropTypes.string,
  sectionTitleClass: PropTypes.string,
  text: PropTypes.string.isRequired
};

Blockquote.defaultProps = {
  sectionWrapperClass: '',
  sectionTitleClass: ''
};

export default Blockquote;
