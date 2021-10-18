import PropTypes from 'prop-types';
import NavItem from '../NavItem/NavItem';
import dropDownMenuLink from '../../../utils/drop-down-menu-link';
import './DropDownMenu.scss';

function DropDownMenu({ sectionWrapperClass }) {
  return (
    <ul className={sectionWrapperClass}>
      {dropDownMenuLink.map((item) => (
        <NavItem
          key={item.title}
          sectionWrapperClass="menu__dropdown-list-item"
          sectionLinkClass="menu__dropdown-link"
          href={item.url}
          linkText={item.title}
        />
      ))}
    </ul>
  );
}

DropDownMenu.propTypes = {
  sectionWrapperClass: PropTypes.string.isRequired,
};

export default DropDownMenu;
