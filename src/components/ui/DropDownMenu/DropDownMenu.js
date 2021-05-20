import PropTypes from 'prop-types';
// import { NavLink } from 'react-router-dom';
import NavItem from '../NavItem/NavItem';
import './DropDownMenu.scss';

function DropDownMenu({ wrapperClasses, textsForLinks }) {
  return (
    <ul className={wrapperClasses}>
      {textsForLinks.map((text) => (
        <NavItem
          wrapperClasses="menu__dropdown-list-item"
          linkClasses="link menu__dropdown-link"
          href="#"
          text={text}
        />
      ))}
    </ul>
  );
}

DropDownMenu.propTypes = {
  wrapperClasses: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  textsForLinks: PropTypes.array.isRequired
};

export default DropDownMenu;
