import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function NavItem({
  sectionWrapperClass, sectionLinkClass, href, linkText, rel, target
}) {
  return (
    <li className={sectionWrapperClass}>
      <NavLink
        className={sectionLinkClass}
        to={href}
        rel={rel}
        target={target}
      >
        {linkText}
      </NavLink>
    </li>
  );
}

NavItem.propTypes = {
  sectionWrapperClass: PropTypes.string.isRequired,
  sectionLinkClass: PropTypes.string.isRequired,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  linkText: PropTypes.string.isRequired,
  rel: PropTypes.string,
  target: PropTypes.string
};

NavItem.defaultProps = {
  rel: '',
  target: '_self',
  href: ''
};

export default NavItem;
