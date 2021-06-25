import PropTypes from 'prop-types';
import NavItem from '../NavItem/NavItem';
import './DropDownMenu.scss';

function DropDownMenu({ sectionWrapperClass, links }) {
  return (
    <ul className={sectionWrapperClass}>
      {links.map(({ text, link }) => (
        <NavItem
          key={text}
          sectionWrapperClass="menu__dropdown-list-item"
          sectionLinkClass="link menu__dropdown-link"
          href={link}
          linkText={text}
        />
      ))}
    </ul>
  );
}

DropDownMenu.propTypes = {
  sectionWrapperClass: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DropDownMenu;
