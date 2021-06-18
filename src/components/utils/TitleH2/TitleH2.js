import PropTypes from 'prop-types';

function TitleH2({ title, className }) {
  return <h2 className={`section-title ${className}`}>{title}</h2>;
}

TitleH2.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string
};

TitleH2.defaultProps = {
  title: '',
  className: ''
};

export default TitleH2;
