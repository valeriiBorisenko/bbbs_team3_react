import './NavItemWithDropdown.scss';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { DropDownMenu } from '../utils/index';

function NavItemWithDropdown({ sectionWrapperClass, linkText, href }) {
  return (
    <li className={sectionWrapperClass}>
      <NavLink className="menu__link" to={href}>
        {linkText}
      </NavLink>

      <DropDownMenu sectionWrapperClass="menu__dropdown-list" />
    </li>
  );
}

NavItemWithDropdown.propTypes = {
  sectionWrapperClass: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

NavItemWithDropdown.defaultProps = {
  href: '',
};

export default NavItemWithDropdown;
