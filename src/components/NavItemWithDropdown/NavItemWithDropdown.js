import './NavItemWithDropdown.scss';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import DropDownMenu from '../utils/DropDownMenu/DropDownMenu';

function NavItemWithDropdown({ sectionWrapperClass, linkText }) {
  return (
    <li className={sectionWrapperClass}>
      <NavLink className="menu__link" to="#">
        {linkText}
      </NavLink>

      <DropDownMenu
        sectionWrapperClass="menu__dropdown-list"
        textsForLinks={['Справочник', 'Видео', 'Статьи', 'Фильмы', 'Книги']}
      />
    </li>
  );
}

NavItemWithDropdown.propTypes = {
  sectionWrapperClass: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};

export default NavItemWithDropdown;
