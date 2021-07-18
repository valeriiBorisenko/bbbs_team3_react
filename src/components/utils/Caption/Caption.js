import PropTypes from 'prop-types';

function Caption({ title, sectionClass }) {
  return <p className={`caption ${sectionClass}`}>{title}</p>;
}

Caption.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string,
};

Caption.defaultProps = {
  title: '',
  sectionClass: '',
};

export default Caption;
