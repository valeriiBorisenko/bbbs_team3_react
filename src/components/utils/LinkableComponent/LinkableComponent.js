import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function LinkableComponent({ Component, path, linkSectionClass, ...props }) {
  return (
    <Link className={linkSectionClass} to={path}>
      <Component {...props} />
    </Link>
  );
}

LinkableComponent.propTypes = {
  Component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  linkSectionClass: PropTypes.string,
};

LinkableComponent.defaultProps = {
  linkSectionClass: '',
};

export default LinkableComponent;
