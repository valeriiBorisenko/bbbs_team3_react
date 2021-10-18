import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './StyledLink.scss';
import { refineClassNames } from '../../../utils/utils';

function StyledLink({
  path,
  text,
  style,
  isExternal,
  isButton,
  onClick,
  sectionClass,
}) {
  const classNames = {
    main: refineClassNames(['styled-link', sectionClass]),
  };

  if (isExternal) {
    return (
      <a
        className={classNames.main}
        href={path}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {text}
      </a>
    );
  }

  if (isButton) {
    return (
      <button
        className={classNames.main}
        type="button"
        onClick={onClick}
        style={style}
      >
        {text}
      </button>
    );
  }

  return (
    <Link className={classNames.main} to={path}>
      {text}
    </Link>
  );
}

StyledLink.propTypes = {
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  text: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  sectionClass: PropTypes.string,
  isExternal: PropTypes.bool,
  isButton: PropTypes.bool,
  onClick: PropTypes.func,
};

StyledLink.defaultProps = {
  path: '',
  text: 'link',
  style: undefined,
  sectionClass: '',
  isExternal: false,
  isButton: false,
  onClick: undefined,
};

export default StyledLink;
