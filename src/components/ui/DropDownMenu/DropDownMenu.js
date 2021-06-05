import PropTypes, { string } from 'prop-types';
// import { NavLink } from 'react-router-dom';
import NavItem from '../NavItem/NavItem';
import './DropDownMenu.scss';

function DropDownMenu({ sectionWrapperClass, textsForLinks }) {
  return (
    <ul className={sectionWrapperClass}>
      {textsForLinks.map((text) => (
        <NavItem
          key={text}
          sectionWrapperClass="menu__dropdown-list-item"
          sectionLinkClass="link menu__dropdown-link"
          href="#"
          linkText={text}
        />
      ))}
    </ul>
  );
}

DropDownMenu.propTypes = {
  sectionWrapperClass: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  textsForLinks: PropTypes.arrayOf(string).isRequired
};

export default DropDownMenu;
