import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { CurrentUserContext } from '../../contexts';
import texts from './locales/RU';
import {
  ABOUT_US_TITLE,
  ABOUT_US_URL,
  AFISHA_TITLE,
  AFISHA_URL,
  MAIN_PAGE_TITLE,
  PLACES_TITLE,
  PLACES_URL,
  QUESTIONS_TITLE,
  QUESTIONS_URL,
  READ_AND_WATCH_TITLE,
  READ_AND_WATCH_URL,
  RIGHTS_TITLE,
  RIGHTS_URL,
  STORIES_TITLE,
  STORIES_URL,
} from '../../config/routes';
import { socialLinks } from '../../utils/external-links';
import { refineClassNames } from '../../utils/utils';
import NavItemWithDropdown from '../NavItemWithDropdown/NavItemWithDropdown';
import Search from '../Search/Search';
import { NavItem, UserIconButton, UserMenuButton } from '../utils';
import './NavBar.scss';

function NavBar({
  isMobileMenuOpen,
  onUserButtonClick,
  onBurgerButtonClick,
  onCityChangeClick,
  onLogout,
  userCityName,
  setIsMobileMenuOpen,
  isOpenSearch,
  setIsOpenSearch,
}) {
  const { pathname } = useLocation();
  const { currentUser } = useContext(CurrentUserContext);

  const handleClick = () => {
    setIsOpenSearch(false);
  };

  const classNames = {
    main: refineClassNames(['menu', isOpenSearch ? 'menu_state_search' : '']),
    menuListsWrap: refineClassNames([
      'menu__lists-wrap',
      !isMobileMenuOpen ? 'menu__lists-wrap_hidden' : '',
    ]),
    menuSocial: refineClassNames([
      'menu__list',
      'menu__list_type_social',
      !isMobileMenuOpen ? 'menu__list_hidden' : '',
    ]),
    menuBurger: refineClassNames([
      'menu__burger',
      isMobileMenuOpen ? 'menu__burger_active' : '',
    ]),
    menuUser: refineClassNames([
      'menu__user-info',
      !isMobileMenuOpen ? 'menu__user-info_hidden' : '',
    ]),
    cityButton: refineClassNames([
      'mobile-link',
      !currentUser ? 'menu__user-info_center' : '',
    ]),
  };

  return (
    <nav className={classNames.main}>
      {/* логотип */}
      <Link
        to="/"
        target="_self"
        className="menu__logo mobile-link"
        onClick={handleClick}
      >
        {MAIN_PAGE_TITLE}
      </Link>
      {/* обычное меню */}
      <div className={classNames.menuListsWrap}>
        <ul className="menu__list">
          {/* О проекте, скрытый */}
          <NavItem
            sectionWrapperClass="menu__list-item menu__list-item_hidden"
            sectionLinkClass="menu__link mobile-link"
            href={ABOUT_US_URL}
            linkText={ABOUT_US_TITLE}
          />
          {/* Календарь */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={AFISHA_URL}
            linkText={AFISHA_TITLE}
          />
          {/* Куда пойти */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={PLACES_URL}
            linkText={PLACES_TITLE}
          />
          {/* Вопросы */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={QUESTIONS_URL}
            linkText={QUESTIONS_TITLE}
          />
          {/* выпадающее меню  "Читать и смотреть" */}
          <NavItemWithDropdown
            sectionWrapperClass="menu__list-item menu__dropdown-item"
            linkText={READ_AND_WATCH_TITLE}
            href={READ_AND_WATCH_URL}
          />
          {/* Права детей */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={RIGHTS_URL}
            linkText={RIGHTS_TITLE}
          />
          {/* Истории */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={STORIES_URL}
            linkText={STORIES_TITLE}
          />
        </ul>

        <ul className={classNames.menuSocial}>
          {React.Children.toArray(
            socialLinks.map((link) => (
              <li className="menu__list-item">
                <a
                  className="menu__link mobile-link"
                  href={link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.title}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>

      {renderUserMenuButtons()}

      <button
        onClick={onBurgerButtonClick}
        className={classNames.menuBurger}
        type="button"
      >
        <span className="menu__burger-line" />
        <span className="menu__burger-line" />
        <span className="menu__burger-line" />
      </button>

      <ul className="menu__button-list">
        <li className="menu__button-item">
          <Search
            isOpenSearch={isOpenSearch}
            setIsOpenSearch={setIsOpenSearch}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </li>
        <li className="menu__button-item">
          <UserIconButton
            sectionClass="mobile-link"
            isAuthorized={!!currentUser}
            handleClick={onUserButtonClick}
          />
        </li>
      </ul>
    </nav>
  );

  function renderLogoutButton() {
    return (
      <UserMenuButton
        title={texts.logoutText}
        sectionClass="mobile-link"
        handleClick={onLogout}
      />
    );
  }

  function renderUserMenuButtons() {
    if (currentUser || pathname === PLACES_URL) {
      return (
        <div className={classNames.menuUser}>
          <UserMenuButton
            title={
              userCityName
                ? `${userCityName}. ${texts.changeCity}`
                : texts.changeCityDefault
            }
            handleClick={onCityChangeClick}
            sectionClass={classNames.cityButton}
          />
          {currentUser && renderLogoutButton()}
        </div>
      );
    }
    return null;
  }
}

NavBar.propTypes = {
  onUserButtonClick: PropTypes.func,
  onBurgerButtonClick: PropTypes.func,
  onCityChangeClick: PropTypes.func,
  onLogout: PropTypes.func,
  isMobileMenuOpen: PropTypes.bool,
  userCityName: PropTypes.string,
  setIsMobileMenuOpen: PropTypes.func,
  isOpenSearch: PropTypes.bool,
  setIsOpenSearch: PropTypes.func,
};

NavBar.defaultProps = {
  onUserButtonClick: () => {},
  onBurgerButtonClick: () => {},
  onCityChangeClick: () => {},
  onLogout: () => {},
  isMobileMenuOpen: false,
  userCityName: '',
  setIsMobileMenuOpen: () => {},
  isOpenSearch: false,
  setIsOpenSearch: () => {},
};

export default NavBar;
