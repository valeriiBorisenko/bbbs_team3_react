/* eslint-disable jsx-a11y/no-static-element-interactions */
// !onClick в <header> используется исключительно для
// !делегирования функции закрытия мобильного меню по клику на ссылки
// !https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md#case-the-event-handler-is-only-being-used-to-capture-bubbled-events

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.scss';
import PropTypes from 'prop-types';
import { useClickOutside } from '../../utils/custom-hooks';
import NavBar from '../ui/NavBar/NavBar';
import UserMenuButton from '../ui/UserMenuButton/UserMenuButton';

function Header({
  isAuthorized,
  onUserButtonClick,
  onLogout,
  onCityChange
}) {
  const { pathname } = useLocation();

  // меню бургер
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleNavMenu = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    else setIsMobileMenuOpen(true);
  };

  // закрытие мобильного меню по клику вне хедера
  const headerRef = useClickOutside(() => setIsMobileMenuOpen(false));

  // закрытие мобильного меню по клику на ссылки
  const handleCloseMobileMenu = (evt) => {
    const el = evt.target;
    if (isMobileMenuOpen && el.classList.contains('mobile-link')) {
      setIsMobileMenuOpen(false);
    }
  };

  // липкий хедер
  const [isHeaderActive, setIsHeaderActive] = useState(true);
  let prevScrollPos = 0;

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const currentScrollPos = window.pageYOffset;
      // если prevScrollPos больше currentScrollPos значит мы скролим наверх
      if (prevScrollPos > currentScrollPos) {
        setIsHeaderActive(true);
      } else {
        setIsHeaderActive(false);
        setIsMobileMenuOpen(false);
      }

      if (currentScrollPos === 0) {
        setIsHeaderActive(true);
      }
      prevScrollPos = currentScrollPos;
    });
  }, []);

  const classNamesHeader = [
    'header',
    isMobileMenuOpen ? 'header_displayed' : '',
    !isHeaderActive ? 'header__on-scroll-up' : ''
  ].join(' ').trim();

  return (
    <header
      className={classNamesHeader}
      ref={headerRef}
      onClick={handleCloseMobileMenu}
      onKeyPress={handleCloseMobileMenu}
    >
      <NavBar
        isAuthorized={isAuthorized}
        onUserButtonClick={onUserButtonClick}
        onBurgerButtonClick={toggleNavMenu}
        onCityChangeClick={onCityChange}
        onLogout={onLogout}
        isNavMenuOpen={isMobileMenuOpen}
      />

      {pathname === '/account' && (
      <div className="header__user-info">
        <UserMenuButton
          title="Изменить город"
          handleClick={onCityChange}
          sectionClass="mobile-link"
        />
        <UserMenuButton
          title="Выйти"
          sectionClass="mobile-link"
          handleClick={onLogout}
        />
      </div>
      )}

      {pathname === '/afisha' && (
      <div className="header__user-info">
        <UserMenuButton
          title="Изменить город"
          handleClick={onCityChange}
          sectionClass="mobile-link"
        />
      </div>
      )}
    </header>
  );
}

Header.propTypes = {
  isAuthorized: PropTypes.bool,
  onUserButtonClick: PropTypes.func,
  onCityChange: PropTypes.func,
  onLogout: PropTypes.func
};

Header.defaultProps = {
  isAuthorized: false,
  onUserButtonClick: undefined,
  onCityChange: undefined,
  onLogout: undefined
};

export default Header;
