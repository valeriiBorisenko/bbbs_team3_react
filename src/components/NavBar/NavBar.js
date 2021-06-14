import './NavBar.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import {
  CurrentUserContext,
  AfishaUrl,
  AboutUsUrl,
  QuestionsUrl,
  PlacesUrl,
  NavItem,
  NavItemWithDropdown,
  SearchButton,
  UserIconButton,
  UserMenuButton
} from './index';

function NavBar({
  isMobileMenuOpen,
  onUserButtonClick,
  onBurgerButtonClick,
  onCityChangeClick,
  onLogout,
  userCityName
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <nav className="menu">
      {/* логотип */}
      <Link to="/" target="_self" className="menu__logo mobile-link">
        наставники.про
      </Link>
      {/* обычное меню */}
      <div className={`menu__lists-wrap ${!isMobileMenuOpen ? 'menu__lists-wrap_hidden' : ''}`}>
        <ul className="menu__list">
          {/* О проекте, скрытый */}
          <NavItem
            sectionWrapperClass="menu__list-item menu__list-item_hidden"
            sectionLinkClass="menu__link mobile-link"
            href={AboutUsUrl}
            linkText="О проекте"
          />
          {/* Календарь */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={AfishaUrl}
            linkText="Календарь"
          />
          {/* Куда пойти */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={PlacesUrl}
            linkText="Куда пойти"
          />
          {/* Вопросы */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={QuestionsUrl}
            linkText="Вопросы"
          />
          {/* выпадающее меню  "Читать и смотреть" */}
          <NavItemWithDropdown
            sectionWrapperClass="menu__list-item menu__dropdown-item"
            linkText="Читать и смотреть"
          />
          {/* Права детей */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href="#"
            linkText="Права детей"
          />
          {/* Истории */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href="#"
            linkText="Истории"
          />
        </ul>

        <ul className={`menu__list menu__list_type_social ${!isMobileMenuOpen ? 'menu__list_hidden' : ''}`}>
          {/* facebook */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={{
              pathname:
                'https://www.facebook.com/BigBrothers.BigSisters.Russia/'
            }}
            linkText="facebook"
            target="_blank"
            rel="noopener noreferrer"
          />
          {/* vkontakte */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={{ pathname: 'https://vk.com/big.brothers.big.sisters' }}
            linkText="vkontakte"
            target="_blank"
            rel="noopener noreferrer"
          />
          {/* instagram */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={{ pathname: 'https://www.instagram.com/nastavniki_org/' }}
            linkText="instagram"
            target="_blank"
            rel="noopener noreferrer"
          />
          {/* youtube */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link mobile-link"
            href={{ pathname: 'https://www.youtube.com/user/Nastavniki/' }}
            linkText="youtube"
            target="_blank"
            rel="noopener noreferrer"
          />
        </ul>
      </div>

      {currentUser && (
      <div className={`menu__user-info ${!isMobileMenuOpen ? 'menu__user-info_hidden' : ''}`}>
        <UserMenuButton
          title={userCityName ? `${userCityName}. Изменить город` : 'Изменить ваш город'}
          handleClick={onCityChangeClick}
          sectionClass="mobile-link"
        />
        <UserMenuButton
          title="Выйти"
          sectionClass="mobile-link"
          handleClick={onLogout}
        />
      </div>
      )}

      <button
        onClick={onBurgerButtonClick}
        className={`menu__burger ${isMobileMenuOpen ? 'menu__burger_active' : ''}`}
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
                placeholder="Поиск"
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
            isAuthorized={currentUser}
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
  userCityName: PropTypes.string
};

NavBar.defaultProps = {
  onUserButtonClick: () => {},
  onBurgerButtonClick: () => {},
  onCityChangeClick: () => {},
  onLogout: () => {},
  isMobileMenuOpen: false,
  userCityName: ''
};

export default NavBar;
