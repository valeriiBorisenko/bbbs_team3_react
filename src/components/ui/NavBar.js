import './NavBar.scss';
// import { NavLink } from 'react-router-dom';
import NavItem from './NavItem';
import NavItemWithDropdown from './NavItemWithDropdown';

function NavBar() {
  return (
    <nav className="menu">
      {/* логотип */}
      <a href="./index.html" target="_self" className="menu__logo">
        наставники.про
      </a>
      {/* обычное меню */}
      <div className="menu__lists-wrap menu__lists-wrap_hidden">
        <ul className="menu__list">
          {/* Календарь */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href="#" text="Календарь" />
          {/* Куда пойти */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href="#" text="Куда пойти" />
          {/* Вопросы */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href="#" text="Вопросы" />
          {/* выпадающее меню  "Читать и смотреть" */}
          <NavItemWithDropdown wrapperClasses="menu__list-item menu__dropdown-item" mainText="Читать и смотреть" textsForLinks={['Справочник', 'Видео', 'Статьи', 'Фильмы', 'Книги']} />
          {/* Права детей */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href="#" text="Права детей" />
          {/* Истории */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href="#" text="Истории" />
        </ul>

        <ul className="menu__list menu__list_type_social menu__list_hidden">
          {/* facebook */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href={{ pathname: 'https://www.facebook.com/BigBrothers.BigSisters.Russia/' }} text="facebook" target="_blank" rel="noreferrer" />
          {/* vkontakte */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href={{ pathname: 'https://vk.com/big.brothers.big.sisters' }} text="vkontakte" target="_blank" rel="noreferrer" />
          {/* instagram */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href={{ pathname: 'https://www.instagram.com/nastavniki_org/' }} text="instagram" target="_blank" rel="noreferrer" />
          {/* youtube */}
          <NavItem wrapperClasses="menu__list-item" linkClasses="menu__link" href={{ pathname: 'https://www.youtube.com/user/Nastavniki/' }} text="youtube" target="_blank" rel="noreferrer" />
        </ul>
      </div>

      <button className="menu__burger" type="button">
        <span className="menu__burger-line" />
        <span className="menu__burger-line" />
        <span className="menu__burger-line" />
      </button>

      <ul className="menu__button-list">
        <li className="menu__button-item">
          <form className="search" name="search-form">
            <button
              className="menu__button menu__button_type_search search__button"
              type="submit"
              aria-label="Поиск"
              title="Поиск"
            />
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
                    Что делать если ваш младший агрессивно себя ведет, решил закрыть
                    пару?
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
          <button
            className="menu__button menu__button_type_user"
            type="button"
            aria-label="Личный кабинет"
            title="Личный кабинет"
          />
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
