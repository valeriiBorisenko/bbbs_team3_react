import './UserMenuButton.scss';
import PropTypes from 'prop-types';

function UserMenuButton({ title, handleClick, sectionClass }) {
  const classNames = ['user-menu-button', sectionClass].join(' ').trim();
  return (
    <button
      className={classNames}
      type="button"
      onClick={handleClick}
    >
      {title}
    </button>
  );
}

UserMenuButton.propTypes = {
  title: PropTypes.string,
  handleClick: PropTypes.func,
  sectionClass: PropTypes.string
};

UserMenuButton.defaultProps = {
  title: '',
  handleClick: undefined,
  sectionClass: ''
};

export default UserMenuButton;
