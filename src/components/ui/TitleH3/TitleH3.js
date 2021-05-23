import PropTypes from 'prop-types';

function TitleH3({ title, sectionClass }) {
  return (
    <h3 className={`chapter-title ${sectionClass}`}>{title}</h3>
  );
}

TitleH3.propTypes = {
  title: PropTypes.string.isRequired,
  sectionClass: PropTypes.string
};

TitleH3.defaultProps = {
  sectionClass: ''
};

export default TitleH3;
