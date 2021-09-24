import './UserIconButton.scss';
import PropTypes from 'prop-types';
import { PROFILE_TITLE } from '../../../config/routes';

function UserIconButton({ sectionClass, isAuthorized, handleClick }) {
  const classNames = [
    'user-button',
    isAuthorized ? 'user-button_authorized' : 'user-button_unauthorized',
    sectionClass,
  ]
    .join(' ')
    .trim();

  return (
    <button
      className={classNames}
      type="button"
      aria-label={PROFILE_TITLE}
      title={PROFILE_TITLE}
      onClick={handleClick}
    />
  );
}

UserIconButton.propTypes = {
  sectionClass: PropTypes.string,
  isAuthorized: PropTypes.bool,
  handleClick: PropTypes.func,
};

UserIconButton.defaultProps = {
  sectionClass: '',
  isAuthorized: false,
  handleClick: () => {},
};

export default UserIconButton;
