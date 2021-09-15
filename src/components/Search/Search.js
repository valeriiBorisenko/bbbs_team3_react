import './Search.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SearchButton, Loader } from '../utils/index';
import { useFormWithValidation } from '../../hooks/index';
import search from '../../api/search';

function Search({
  isOpenSearch,
  setIsOpenSearch,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const { values, handleChange, resetForm } = useFormWithValidation();
  const [searchValue, setSearchValue] = useState([]);
  const [isVoidSearch, setIsVoidSearch] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleClickButton = () => {
    setIsOpenSearch(!isOpenSearch);
    resetForm();
    setSearchValue([]);
    setIsVoidSearch(false);
  };

  const renderSearchItems = () => {
    if (isVoidSearch)
      return (
        <p className="search__content_type_void">
          По вашему заросу ничего не найдено
        </p>
      );

    if (searchValue.length > 0) {
      return (
        <ul className="search__option-list">
          {searchValue.map((item) => (
            <li className="search__option-item">
              <Link
                to={`/${item.path}`}
                className="search__title-link section-title section-title_clickable"
              >
                {item.title}
              </Link>
              <Link to={`/${item.page}`} className="link search__link">
                {item.modelName}
              </Link>
            </li>
          ))}
        </ul>
      );
    }

    return <p className="search__content_type_ask">Введите свой запрос</p>;
  };

  const renderSearchContent = () =>
    isLoadingSearch ? <Loader isNested /> : renderSearchItems();

  const searchTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(async () => {
        const { count, results } = await search({ text: values.search });
        setSearchValue(results);
        setIsLoadingSearch(false);
        return count === 0 ? setIsVoidSearch(true) : setIsVoidSearch(false);
      }, 500)
    );
  };

  useEffect(() => {
    if (!('search' in values)) return;

    setIsLoadingSearch(true);
    searchTimer();
  }, [values]);

  useEffect(() => {
    if (isMobileMenuOpen) setIsOpenSearch(false);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isOpenSearch) setIsMobileMenuOpen(false);
  }, [isOpenSearch]);

  return (
    <form className="search" name="search-form">
      <SearchButton
        isOpenSearch={isOpenSearch}
        handleClickButton={handleClickButton}
      />
      <div
        className={`search__options menu__search-options ${
          isOpenSearch ? 'search__options_visible' : ''
        }`}
      >
        <div className="search__container-input">
          <input
            type="text"
            name="search"
            placeholder=""
            className="search__input paragraph"
            autoComplete="off"
            onChange={handleChange}
            value={values.search || ''}
          />
          <button
            type="button"
            aria-label="Закрыть"
            className="search__close-button"
            onClick={handleClickButton}
          />
        </div>

        {renderSearchContent()}
      </div>
    </form>
  );
}

Search.propTypes = {
  isOpenSearch: PropTypes.bool,
  setIsOpenSearch: PropTypes.func,
  isMobileMenuOpen: PropTypes.bool,
  setIsMobileMenuOpen: PropTypes.func,
};

Search.defaultProps = {
  isOpenSearch: false,
  setIsOpenSearch: () => {},
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => {},
};

export default Search;
