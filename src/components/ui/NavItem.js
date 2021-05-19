import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function NavItem({
  wrapperClasses, linkClasses, href, text, rel, target
}) {
  return (
    <li className={wrapperClasses}>
      <NavLink className={linkClasses} to={href} rel={rel} target={target}>
        {text}
      </NavLink>
    </li>
  );
}

NavItem.propTypes = {
  wrapperClasses: PropTypes.string.isRequired,
  linkClasses: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  href: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired,
  rel: PropTypes.string,
  target: PropTypes.string
};

NavItem.defaultProps = {
  rel: '',
  target: '_self'
};

export default NavItem;
