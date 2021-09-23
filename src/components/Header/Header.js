import { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import {
  CitiesContext,
  CurrentUserContext,
  PopupsContext,
} from '../../contexts';
import { useAuth, useClickOutside, useLocalStorage } from '../../hooks';
import { AFISHA_URL, PLACES_URL, PROFILE_URL } from '../../config/routes';
import { localStUserCity } from '../../config/constants';
import NavBar from '../NavBar/NavBar';
import { UserMenuButton } from '../utils';
import './Header.scss';

function Header({ isTransparentOnTop }) {
  const history = useHistory();
  const { pathname } = useLocation();

  const { currentUser, updateUser } = useContext(CurrentUserContext);
  const { openPopupCities, openPopupLogin, closeAllPopups } =
    useContext(PopupsContext);
  const { cities } = useContext(CitiesContext);

  const { handleLogout } = useAuth(updateUser, closeAllPopups);

  const [userCityName, setUserCityName] = useState('');
  let currentAnonymousCity;

  if (pathname === PLACES_URL) {
    const getLocalStorageItem = useLocalStorage(localStUserCity);
    currentAnonymousCity = getLocalStorageItem();
  }

  // сохранённый в localStorage город анонимуса
  const userCity = currentUser?.city ?? currentAnonymousCity;

  // определение города пользователя, используется в кнопках
  useEffect(() => {
    if (cities && userCity) {
      const currentCity = cities.find((city) => city?.id === userCity);
      setUserCityName(currentCity?.name);
    }
  }, [cities, userCity]);

  // клик по иконке человечка
  const handleUserButtonClick = () => {
    if (currentUser) history.push(PROFILE_URL);
    else openPopupLogin();
  };

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

  // состояние поиска
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  // состояния хедера
  const [isHeaderActive, setIsHeaderActive] = useState(true);
  const [isHeaderOnTop, setIsHeaderOnTop] = useState(true);
  let prevScrollPos = 0;

  const detectHeaderOnTop = () => {
    if (window.scrollY === 0) setIsHeaderOnTop(true);
    else if (window.scrollY > 0 && isHeaderOnTop) setIsHeaderOnTop(false);
  };

  const detectScrollUp = () => {
    if (isTransparentOnTop) detectHeaderOnTop();

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
  };

  let debounceTimer;
  const debouncedScrollUp = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      detectScrollUp();
    }, 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', debouncedScrollUp);
    return () => window.removeEventListener('scroll', debouncedScrollUp);
  }, []);

  const classNamesHeader = [
    'header',
    isTransparentOnTop && isHeaderOnTop && !isOpenSearch
      ? 'header_transparent'
      : '',
    isMobileMenuOpen ? 'header_displayed' : '',
    !isHeaderActive && !isOpenSearch ? 'header__on-scroll-up' : '',
  ]
    .join(' ')
    .trim();

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isOpenSearch={isOpenSearch}
          setIsOpenSearch={setIsOpenSearch}
        />

        {(pathname === AFISHA_URL ||
          pathname === PLACES_URL ||
          pathname === PROFILE_URL) && (
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
            {renderExitButton()}
          </div>
        )}
      </div>
    </header>
  );

  function renderExitButton() {
    if (pathname === PROFILE_URL) {
      return (
        <UserMenuButton
          title={texts.logoutText}
          sectionClass="mobile-link"
          handleClick={handleLogout}
        />
      );
    }
    return null;
  }
}

Header.propTypes = {
  isTransparentOnTop: PropTypes.bool,
};

Header.defaultProps = {
  isTransparentOnTop: false,
};

export default Header;
