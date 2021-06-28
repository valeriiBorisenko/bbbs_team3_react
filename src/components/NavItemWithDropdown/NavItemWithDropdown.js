import './NavItemWithDropdown.scss';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import DropDownMenu from '../utils/DropDownMenu/DropDownMenu';
import { CATALOG_URL } from '../../config/routes';

function NavItemWithDropdown({ sectionWrapperClass, linkText, href }) {
  return (
    <li className={sectionWrapperClass}>
      <NavLink className="menu__link" to={href}>
        {linkText}
      </NavLink>

      <DropDownMenu
        sectionWrapperClass="menu__dropdown-list"
        links={[
          { text: 'Справочник', link: CATALOG_URL },
          { text: 'Видео', link: CATALOG_URL },
          { text: 'Статьи', link: CATALOG_URL },
          { text: 'Фильмы', link: CATALOG_URL },
          { text: 'Книги', link: CATALOG_URL },
        ]}
      />
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
