import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import './NavItemWithDropdown.scss';

function NavItemWithDropdown({ wrapperClasses, text }) {
  return (
    <li className={wrapperClasses}>
      <NavLink className="menu__link" to="#">
        {text}
      </NavLink>
      <DropDownMenu wrapperClasses="menu__dropdown-list" textsForLinks={['Справочник', 'Видео', 'Статьи', 'Фильмы', 'Книги']} />
    </li>
  );
}

NavItemWithDropdown.propTypes = {
  wrapperClasses: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default NavItemWithDropdown;
