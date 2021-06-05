import './UserButton.scss';
import PropTypes from 'prop-types';

function UserButton({ sectionClass, isAuthorized, handleClick }) {
  const classNames = [
    'user-button',
    isAuthorized ? 'user-button_authorized' : 'user-button_unauthorized',
    sectionClass
  ].join(' ').trim();

  return (
    <button
      className={classNames}
      type="button"
      aria-label="Личный кабинет"
      title="Личный кабинет"
      onClick={handleClick}
    />
  );
}

UserButton.propTypes = {
  sectionClass: PropTypes.string,
  isAuthorized: PropTypes.objectOf(PropTypes.any),
  handleClick: PropTypes.func
};

UserButton.defaultProps = {
  sectionClass: '',
  isAuthorized: false,
  handleClick: undefined
};

export default UserButton;
