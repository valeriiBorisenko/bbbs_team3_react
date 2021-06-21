import PropTypes from 'prop-types';

function TitleH2({ title, sectionClass }) {
  return <h2 className={`section-title ${sectionClass}`}>{title}</h2>;
}

TitleH2.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string
};

TitleH2.defaultProps = {
  title: '',
  sectionClass: ''
};

export default TitleH2;
