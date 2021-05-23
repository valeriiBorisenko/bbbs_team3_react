import './NavBar.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NavItem from '../NavItem/NavItem';
import NavItemWithDropdown from '../NavItemWithDropdown/NavItemWithDropdown';
import SearchButton from '../SearchButton/SearchButton';
import UserButton from '../UserButton/UserButton';

function NavBar({ isAuthorized, handleUserButtonClick }) {
  // временное решение по открытию бургера
  function burgerClickHandler() {
    document.querySelector('.header').classList.toggle('header_displayed');
    document.querySelector('.menu__burger').classList.toggle('menu__burger_active');
    document.querySelector('.menu__lists-wrap').classList.toggle('menu__lists-wrap_hidden');
    document.querySelector('.menu__list_type_social').classList.toggle('menu__list_hidden');
  }

  return (
    <nav className="menu">
      {/* логотип */}
      <Link
        to="/"
        target="_self"
        className="menu__logo"
      >
        наставники.про
      </Link>
      {/* обычное меню */}
      <div className="menu__lists-wrap menu__lists-wrap_hidden">
        <ul className="menu__list">
          {/* О проекте, скрытый */}
          <NavItem
            sectionWrapperClass="menu__list-item menu__list-item_hidden"
            sectionLinkClass="menu__link"
            href="about-us"
            linkText="О проекте"
          />
          {/* Календарь */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href="#"
            linkText="Календарь"
          />
          {/* Куда пойти */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href="#"
            linkText="Куда пойти"
          />
          {/* Вопросы */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href="#"
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
            sectionLinkClass="menu__link"
            href="#"
            linkText="Права детей"
          />
          {/* Истории */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href="#"
            linkText="Истории"
          />
        </ul>

        <ul className="menu__list menu__list_type_social menu__list_hidden">
          {/* facebook */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href={{
              pathname:
                'https://www.facebook.com/BigBrothers.BigSisters.Russia/'
            }}
            linkText="facebook"
            target="_blank"
            rel="noreferrer"
          />
          {/* vkontakte */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href={{ pathname: 'https://vk.com/big.brothers.big.sisters' }}
            linkText="vkontakte"
            target="_blank"
            rel="noreferrer"
          />
          {/* instagram */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href={{ pathname: 'https://www.instagram.com/nastavniki_org/' }}
            linkText="instagram"
            target="_blank"
            rel="noreferrer"
          />
          {/* youtube */}
          <NavItem
            sectionWrapperClass="menu__list-item"
            sectionLinkClass="menu__link"
            href={{ pathname: 'https://www.youtube.com/user/Nastavniki/' }}
            linkText="youtube"
            target="_blank"
            rel="noreferrer"
          />
        </ul>
      </div>

      <button
        onClick={burgerClickHandler}
        className="menu__burger"
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
                value=""
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
          <UserButton
            isAuthorized={isAuthorized}
            handleClick={handleUserButtonClick}
          />
        </li>
      </ul>
    </nav>
  );
}

NavBar.propTypes = {
  isAuthorized: PropTypes.bool,
  handleUserButtonClick: PropTypes.func
};

NavBar.defaultProps = {
  isAuthorized: false,
  handleUserButtonClick: undefined
};

export default NavBar;
