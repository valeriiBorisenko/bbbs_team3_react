import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function LinkableComponent({
  Component,
  path,
  linkSectionClass,
  isExternal,
  ...props
}) {
  if (isExternal) {
    return (
      <a
        className={linkSectionClass}
        href={path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Component {...props} />
      </a>
    );
  }

  return (
    <Link className={linkSectionClass} to={path}>
      <Component {...props} />
    </Link>
  );
}

LinkableComponent.propTypes = {
  Component: PropTypes.func.isRequired,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  linkSectionClass: PropTypes.string,
  isExternal: PropTypes.bool,
};

LinkableComponent.defaultProps = {
  linkSectionClass: '',
  isExternal: false,
};

export default LinkableComponent;
