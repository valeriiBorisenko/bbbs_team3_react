import './UserButton.scss';
import PropTypes from 'prop-types';

function UserButton({ isAuthorized }) {
  return (
    <button
      className={`user-button ${
        isAuthorized ? 'user-button_authorized' : 'user-button_unauthorized'
      }`}
      type="button"
      aria-label="Личный кабинет"
      title="Личный кабинет"
    ></button>
  );
}

UserButton.propTypes = {
  isAuthorized: PropTypes.bool,
};

export default UserButton;
