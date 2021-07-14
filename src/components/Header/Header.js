/* eslint-disable jsx-a11y/no-static-element-interactions */
import './Header.scss';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  CurrentUserContext,
  CitiesContext,
  PopupsContext,
} from '../../contexts/index';
import texts from './locales/RU';
import { useClickOutside, useAuth, useLocalStorage } from '../../hooks/index';
import { PROFILE_URL, AFISHA_URL, PLACES_URL } from '../../config/routes';
import { localStUserCity } from '../../config/constants';
import NavBar from '../NavBar/NavBar';
import { UserMenuButton } from '../utils/index';

function Header() {
  const history = useHistory();
  const { pathname } = useLocation();

  const { currentUser, updateUser } = useContext(CurrentUserContext);
  const { openPopupCities, openPopupLogin, closeAllPopups } =
    useContext(PopupsContext);
  const { cities } = useContext(CitiesContext);

  const { handleLogout } = useAuth(updateUser, closeAllPopups);

  function handleUserButtonClick() {
    if (currentUser) {
      history.push(PROFILE_URL);
    } else {
      openPopupLogin();
    }
  }

  const [userCityName, setUserCityName] = useState('');
  let currentAnonymousCity;

  if (pathname === PLACES_URL) {
    const getLocalStorageItem = useLocalStorage(localStUserCity);
    currentAnonymousCity = getLocalStorageItem();
  }

  // сохранённый в localStorage город анонимуса
  const userCity = currentUser?.city || currentAnonymousCity;

  // определение города пользователя, используется в кнопках
  useEffect(() => {
    if (cities && userCity) {
      const currentCity = cities.find((city) => city?.id === userCity);
      setUserCityName(currentCity?.name);
    }
  }, [cities, userCity]);

  // меню бургер
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // закрытие мобильного меню по клику вне хедера
  const headerRef = useClickOutside(() => setIsMobileMenuOpen(false));

  // закрытие мобильного меню по клику на ссылки
  const handleCloseMobileMenu = (evt) => {
    const { target } = evt;
    if (isMobileMenuOpen && target.classList.contains('mobile-link')) {
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
    !isHeaderActive ? 'header__on-scroll-up' : '',
  ]
    .join(' ')
    .trim();

  return (
    <header
      className={classNamesHeader}
      ref={headerRef}
      onClick={handleCloseMobileMenu}
      onKeyPress={handleCloseMobileMenu}
    >
      <div className="header__container">
        <NavBar
          onUserButtonClick={handleUserButtonClick}
          onBurgerButtonClick={toggleMobileMenu}
          userCityName={userCityName}
          onCityChangeClick={openPopupCities}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {pathname === PROFILE_URL && (
          <div className="header__user-info">
            <UserMenuButton
              title={
                userCityName
                  ? `${userCityName}. ${texts.changeCity}`
                  : texts.changeCityDefault
              }
              sectionClass="mobile-link"
              handleClick={openPopupCities}
            />
            <UserMenuButton
              title={texts.logoutText}
              sectionClass="mobile-link"
              handleClick={handleLogout}
            />
          </div>
        )}

        {(pathname === AFISHA_URL || pathname === PLACES_URL) && (
          <div className="header__user-info">
            <UserMenuButton
              title={
                userCityName
                  ? `${userCityName}. ${texts.changeCity}`
                  : texts.changeCityDefault
              }
              handleClick={openPopupCities}
              sectionClass="mobile-link"
            />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
