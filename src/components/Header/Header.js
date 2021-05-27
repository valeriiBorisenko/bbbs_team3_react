import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.scss';
import PropTypes from 'prop-types';
import NavBar from '../ui/NavBar/NavBar';
import UserMenuButton from '../ui/UserMenuButton/UserMenuButton';

function Header({ isAuthorized, handleUserButtonClick, handleChangeCity }) {
  const { pathname } = useLocation();

  // меню бургер
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleNavMenu = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    else setIsMobileMenuOpen(true);
  };

  // липкий хедер
  const [isHeaderActive, setIsHeaderActive] = useState(true);
  let prevScrollpos = 0;

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const currentScrollPos = window.pageYOffset;
      // если prevScrollpos больше currentScrollPos значит мы скролим наверх уже
      if (prevScrollpos > currentScrollPos) {
        setIsHeaderActive(true);
      } else {
        setIsHeaderActive(false);
        setIsMobileMenuOpen(false);
      }

      if (currentScrollPos === 0) {
        setIsHeaderActive(true);
      }
      prevScrollpos = currentScrollPos;
    });
  }, []);

  return (
    <header
      className={`header ${isMobileMenuOpen ? 'header_displayed' : ''} ${
        !isHeaderActive ? 'header__on-scroll-up' : ''
      }`}
    >
      <NavBar
        isAuthorized={isAuthorized}
        handleUserButtonClick={handleUserButtonClick}
        handleBurgerClick={toggleNavMenu}
        handleChangeCity={handleChangeCity}
        isNavMenuOpen={isMobileMenuOpen}
      />

      {pathname === '/account' && (
        <div className="header__user-info">
          <UserMenuButton title="Изменить город" handleClick={handleChangeCity} />
          <UserMenuButton title="Выйти" />
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  isAuthorized: PropTypes.bool,
  handleUserButtonClick: PropTypes.func,
  handleChangeCity: PropTypes.func
};

Header.defaultProps = {
  isAuthorized: false,
  handleUserButtonClick: undefined,
  handleChangeCity: undefined
};

export default Header;
