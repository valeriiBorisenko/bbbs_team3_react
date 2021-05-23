import './TitleH1.scss';
import PropTypes from 'prop-types';

function TitleH1({ title, sectionClass }) {
  return (
    <h1 className={`main-title ${sectionClass}`}>{title}</h1>
  );
}

TitleH1.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string
};

TitleH1.defaultProps = {
  title: '',
  sectionClass: ''
};

export default TitleH1;
