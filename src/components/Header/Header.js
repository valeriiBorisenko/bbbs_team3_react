import './Header.scss';
import PropTypes from 'prop-types';
import NavBar from '../ui/NavBar/NavBar';

function Header({ isAuthorized, handleUserButtonClick }) {
  return (
    <header className="header page__section">
      <NavBar isAuthorized={isAuthorized} handleUserButtonClick={handleUserButtonClick} />
    </header>
  );
}

Header.propTypes = {
  isAuthorized: PropTypes.bool,
  handleUserButtonClick: PropTypes.func
};

Header.defaultProps = {
  isAuthorized: false,
  handleUserButtonClick: undefined
};

export default Header;
