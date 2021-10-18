import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './UserMenuButton.scss';

function UserMenuButton({ title, handleClick, sectionClass }) {
  const classNames = {
    main: refineClassNames(['user-menu-button', sectionClass]),
  };

  return (
    <button className={classNames.main} type="button" onClick={handleClick}>
      {title}
    </button>
  );
}

UserMenuButton.propTypes = {
  title: PropTypes.string,
  handleClick: PropTypes.func,
  sectionClass: PropTypes.string,
};

UserMenuButton.defaultProps = {
  title: '',
  handleClick: undefined,
  sectionClass: '',
};

export default UserMenuButton;
