import './UserMenuButton.scss';
import PropTypes from 'prop-types';

function UserMenuButton({ title, handleClick }) {
  return (
    <button
      className="user-menu-button"
      type="button"
      onClick={handleClick}
    >
      {title}
    </button>
  );
}

UserMenuButton.propTypes = {
  title: PropTypes.string,
  handleClick: PropTypes.func
};

UserMenuButton.defaultProps = {
  title: '',
  handleClick: undefined
};

export default UserMenuButton;
