import './NavBar.scss';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import texts from './locales/RU';
import {
  AFISHA_URL,
  ABOUT_US_URL,
  QUESTIONS_URL,
  PLACES_URL,
  RIGHTS_URL,
  READ_AND_WATCH_URL,
  HISTORY_URL,
  MAIN_PAGE_TITLE,
  ABOUT_US_TITLE,
  AFISHA_TITLE,
  PLACES_TITLE,
  QUESTIONS_TITLE,
  READ_AND_WATCH_TITLE,
  RIGHTS_TITLE,
  HISTORY_TITLE,
} from '../../config/routes';
import { socialLinks } from '../../utils/external-links';
import NavItemWithDropdown from '../NavItemWithDropdown/NavItemWithDropdown';
import {
  NavItem,
  SearchButton,
  UserIconButton,
  UserMenuButton,
} from '../utils/index';

function NavBar({
  isMobileMenuOpen,
  onUserButtonClick,
  onBurgerButtonClick,
  onCityChangeClick,
  onLogout,
  userCityName,
}) {
  const { pathname } = useLocation();
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <nav className="menu">
      {/* логотип */}
      <Link to="/" target="_self" className="menu__logo mobile-link">
        {MAIN_PAGE_TITLE}
      </Link>
      {/* обычное меню */}
      <div
        className={`menu__lists-wrap ${
          !isMobileMenuOpen ? 'menu__lists-wrap_hidden' : ''
        }`}
      >
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
            href={HISTORY_URL}
            linkText={HISTORY_TITLE}
          />
        </ul>

        <ul
          className={`menu__list menu__list_type_social ${
            !isMobileMenuOpen ? 'menu__list_hidden' : ''
          }`}
        >
          {socialLinks.map((link) => (
            <li key={link?.id} className="menu__list-item">
              <a
                className="menu__link mobile-link"
                href={link?.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link?.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {currentUser && (
        <div
          className={`menu__user-info ${
            !isMobileMenuOpen ? 'menu__user-info_hidden' : ''
          }`}
        >
          <UserMenuButton
            title={
              userCityName
                ? `${userCityName}. ${texts.changeCity}`
                : texts.changeCityDefault
            }
            handleClick={onCityChangeClick}
            sectionClass="mobile-link"
          />
          <UserMenuButton
            title={texts.logoutText}
            sectionClass="mobile-link"
            handleClick={onLogout}
          />
        </div>
      )}

      {!currentUser && pathname === PLACES_URL && (
        <div
          className={`menu__user-info ${
            !isMobileMenuOpen ? 'menu__user-info_hidden' : ''
          }`}
        >
          <UserMenuButton
            title={
              userCityName
                ? `${userCityName}. ${texts.changeCity}`
                : texts.changeCityDefault
            }
            handleClick={onCityChangeClick}
            sectionClass="mobile-link"
          />
        </div>
      )}

      <button
        onClick={onBurgerButtonClick}
        className={`menu__burger ${
          isMobileMenuOpen ? 'menu__burger_active' : ''
        }`}
        type="button"
      >
        <span className="menu__burger-line" />
        <span className="menu__burger-line" />
        <span className="menu__burger-line" />
      </button>

      <ul className="menu__button-list">
        <li className="menu__button-item">
          <form className="search" name="search-form">
            <SearchButton />
            <div className="search__options menu__search-options">
              <input
                type="text"
                name="search"
                placeholder={texts.searchPlaceholder}
                className="search__input paragraph"
              />
              <ul className="search__option-list">
                <li className="search__option-item">
                  <a
                    href="./article.html"
                    className="search__title-link section-title section-title_clickable"
                  >
                    Причины подростковой агрессии
                  </a>
                  <a href="./article.html" className="link search__link">
                    статьи
                  </a>
                </li>
                <li className="search__option-item">
                  <a
                    href="./video.html"
                    className="search__title-link section-title section-title_clickable"
                  >
                    Агрессивное поведение детей-сирот
                  </a>
                  <a href="./video.html" className="link search__link">
                    видео
                  </a>
                </li>
                <li className="search__option-item">
                  <a
                    href="./questions.html"
                    className="search__title-link section-title section-title_clickable"
                  >
                    Что делать если ваш младший агрессивно себя ведет, решил
                    закрыть пару?
                  </a>
                  <a href="./questions.html" className="link search__link">
                    вопросы
                  </a>
                </li>
                <li className="search__option-item">
                  <a
                    href="./books.html"
                    className="search__title-link section-title section-title_clickable"
                  >
                    Как реагировать на агрессивное поведения ребенка
                  </a>
                  <a href="./books.html" className="link search__link">
                    книги
                  </a>
                </li>
              </ul>
            </div>
          </form>
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
}

NavBar.propTypes = {
  onUserButtonClick: PropTypes.func,
  onBurgerButtonClick: PropTypes.func,
  onCityChangeClick: PropTypes.func,
  onLogout: PropTypes.func,
  isMobileMenuOpen: PropTypes.bool,
  userCityName: PropTypes.string,
};

NavBar.defaultProps = {
  onUserButtonClick: () => {},
  onBurgerButtonClick: () => {},
  onCityChangeClick: () => {},
  onLogout: () => {},
  isMobileMenuOpen: false,
  userCityName: '',
};

export default NavBar;
