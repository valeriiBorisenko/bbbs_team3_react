import './Rubric.scss';
import PropTypes from 'prop-types';

function Rubric({ title, sectionClass }) {
  return <span className={`rubric ${sectionClass}`}>{title}</span>;
}

Rubric.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string,
};

Rubric.defaultProps = {
  title: '',
  sectionClass: '',
};

export default Rubric;
