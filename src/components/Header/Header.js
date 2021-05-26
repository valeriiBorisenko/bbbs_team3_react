import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.scss';
import PropTypes from 'prop-types';
import NavBar from '../ui/NavBar/NavBar';
import UserMenuButton from '../ui/UserMenuButton/UserMenuButton';

function Header({ isAuthorized, handleUserButtonClick, handleChangeCity }) {
  const { pathname } = useLocation();

  // меню бургер
  const [isNavMenuOpen, setNavMenuOpen] = useState(false);

  const toggleNavMenu = () => {
    if (isNavMenuOpen) setNavMenuOpen(false);
    else setNavMenuOpen(true);
  };

  // липкий хедер
  const [isHeaderActive, setHeaderActive] = useState(true);
  let prevScrollpos = 0;

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const currentScrollPos = window.pageYOffset;
      // если prevScrollpos больше currentScrollPos значит мы скролим наверх уже
      if (prevScrollpos > currentScrollPos) {
        setHeaderActive(true);
      } else {
        setHeaderActive(false);
        setNavMenuOpen(false);
      }

      if (currentScrollPos === 0) {
        setHeaderActive(true);
      }
      prevScrollpos = currentScrollPos;
    });
  }, []);

  return (
    <header
      className={`header ${isNavMenuOpen ? 'header_displayed' : ''} ${
        !isHeaderActive ? 'header__on-scroll-up' : ''
      }`}
    >
      <NavBar
        isAuthorized={isAuthorized}
        handleUserButtonClick={handleUserButtonClick}
        handleBurgerClick={toggleNavMenu}
        handleChangeCity={handleChangeCity}
        isNavMenuOpen={isNavMenuOpen}
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
