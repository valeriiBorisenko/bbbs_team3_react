import './Rubric.scss';
import PropTypes from 'prop-types';

function Rubric({ title }) {
  return (
    <span className="rubric">{title}</span>
  );
}

Rubric.propTypes = {
  title: PropTypes.string
};

Rubric.defaultProps = {
  title: ''
};

export default Rubric;
