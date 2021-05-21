import './TitleH3.scss';
import PropTypes from 'prop-types';

function TitleH3({ title, sectionClass }) {
  return (
    <h1 className={`chapter-title ${sectionClass}`}>{title}</h1>
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
