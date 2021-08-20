/* eslint-disable no-unused-vars */
import './Search.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { SearchButton } from '../utils/index';

function Search({ isOpenSearch, setIsOpenSearch }) {
  return (
    <form className="search" name="search-form">
      <SearchButton
        isOpenSearch={isOpenSearch}
        setIsOpenSearch={setIsOpenSearch}
      />
      <div
        className={`search__options menu__search-options ${
          isOpenSearch && 'search__options_visible'
        }`}
      >
        <div className="search__container-input">
          <input
            type="text"
            name="search"
            placeholder="Введите ваш запрос"
            className="search__input paragraph"
          />
          <button
            type="button"
            aria-label="Закрыть"
            className="search__close-button"
            onClick={() => setIsOpenSearch(!isOpenSearch)}
          />
        </div>

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
  );
}

Search.propTypes = {
  isOpenSearch: PropTypes.bool,
  setIsOpenSearch: PropTypes.func,
};

Search.defaultProps = {
  isOpenSearch: false,
  setIsOpenSearch: () => {},
};

export default Search;
