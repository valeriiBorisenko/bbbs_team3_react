import './StyledLink.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function StyledLink({ path, text, isExternal, isButton, sectionClass }) {
  const classNames = ['styled-link', sectionClass].join(' ').trim();

  if (isExternal) {
    return (
      <a
        className={sectionClass}
        href={path}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  if (isButton) {
    return (
      <button className={sectionClass} type="button">
        {text}
      </button>
    );
  }

  return (
    <Link className={classNames} to={path}>
      {text}
    </Link>
  );
}

StyledLink.propTypes = {
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  text: PropTypes.string,
  sectionClass: PropTypes.string,
  isExternal: PropTypes.bool,
  isButton: PropTypes.bool,
};

StyledLink.defaultProps = {
  text: 'link',
  sectionClass: '',
  isExternal: false,
  isButton: false,
};

export default StyledLink;
