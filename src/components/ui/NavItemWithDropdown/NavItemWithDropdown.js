import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import DropDownMenu from '../DropDownMenu/DropDownMenu';

function NavItemWithDropdown({ wrapperClasses, mainText, textsForLinks }) {
  return (
    <li className={wrapperClasses}>
      <NavLink className="menu__link" to="#">
        {mainText}
      </NavLink>
      <DropDownMenu wrapperClasses="menu__dropdown-list" textsForLinks={textsForLinks} />
    </li>
  );
}

NavItemWithDropdown.propTypes = {
  wrapperClasses: PropTypes.string.isRequired,
  mainText: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  textsForLinks: PropTypes.array.isRequired
};

export default NavItemWithDropdown;
