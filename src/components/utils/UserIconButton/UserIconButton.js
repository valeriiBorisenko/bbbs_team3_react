import PropTypes from 'prop-types';
import { PROFILE_TITLE } from '../../../config/routes';
import { COLOR_BLACK, COLOR_BLUE } from '../../../config/constants';
import { refineClassNames } from '../../../utils/utils';
import './UserIconButton.scss';

function UserIconButton({ sectionClass, isAuthorized, handleClick }) {
  const classNames = {
    main: refineClassNames(['user-button', sectionClass]),
  };

  return (
    <button
      className={classNames.main}
      type="button"
      aria-label={PROFILE_TITLE}
      title={PROFILE_TITLE}
      onClick={handleClick}
    >
      <svg
        width="20"
        height="21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.5 5.364c0 2.486-2.014 4.5-4.5 4.5a4.499 4.499 0 0 1-4.5-4.5c0-2.487 2.014-4.5 4.5-4.5s4.5 2.013 4.5 4.5zm-14 12.5c0-.648.32-1.252.932-1.817.616-.568 1.491-1.061 2.502-1.466 2.023-.81 4.46-1.217 6.066-1.217 1.606 0 4.043.407 6.066 1.217 1.01.405 1.887.898 2.502 1.466.612.565.932 1.169.932 1.817v2H.5v-2z"
          stroke={`${isAuthorized ? COLOR_BLUE : COLOR_BLACK}`}
          fill={`${isAuthorized ? COLOR_BLUE : 'none'}`}
        />
      </svg>
    </button>
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
  handleClick: undefined,
};

export default UserIconButton;
