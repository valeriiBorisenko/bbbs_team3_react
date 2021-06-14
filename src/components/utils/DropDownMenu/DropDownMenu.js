import PropTypes from 'prop-types';
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
  textsForLinks: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default DropDownMenu;
