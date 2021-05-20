import './UserButton.scss';
import PropTypes from 'prop-types';

function UserButton({ isAuthorized, handleClick }) {
  return (
    <button
      className={`user-button ${
        isAuthorized ? 'user-button_authorized' : 'user-button_unauthorized'
      }`}
      type="button"
      aria-label="Личный кабинет"
      title="Личный кабинет"
      onClick={handleClick}
    />
  );
}

UserButton.propTypes = {
  isAuthorized: PropTypes.bool,
  handleClick: PropTypes.func
};

UserButton.defaultProps = {
  isAuthorized: false,
  handleClick: undefined
};

export default UserButton;
