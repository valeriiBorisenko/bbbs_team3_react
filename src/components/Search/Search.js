import './Search.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SearchButton, Loader } from '../utils/index';
import { useFormWithValidation } from '../../hooks/index';
import search from '../../api/search';

function Search({ isOpenSearch, setIsOpenSearch }) {
  const { values, handleChange, resetForm } = useFormWithValidation();
  const [searchValue, setSearchValue] = useState([]);
  const [isVoidSearch, setIsVoidSearch] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const handleClickButton = () => {
    setIsOpenSearch(!isOpenSearch);
    resetForm();
    setSearchValue([]);
    setIsVoidSearch(false);
  };

  const renderSearchItems = () => {
    if (isVoidSearch) return <div>По вашему заросу ничего не найдено</div>;

    if (searchValue.length > 0) {
      return (
        <ul className="search__option-list">
          {searchValue.map((item) => (
            <li className="search__option-item">
              <a
                href="/"
                className="search__title-link section-title section-title_clickable"
              >
                {item.title}
              </a>
              <a href="/" className="link search__link">
                {item.modelName}
              </a>
            </li>
          ))}
        </ul>
      );
    }

    // return <></>;
    return <div>Воспользуйтесь поиском</div>;
  };

  const renderSearchContent = () =>
    isLoadingSearch ? <Loader isNested /> : renderSearchItems();

  useEffect(() => {
    if (!('search' in values)) return;

    setIsLoadingSearch(true);

    search({ text: values.search })
      .then(({ count, results }) => {
        if (count === 0) {
          setIsVoidSearch(true);
        } else {
          setIsVoidSearch(false);
        }

        setSearchValue(results);
      })
      .finally(setIsLoadingSearch(false));
  }, [values]);

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
            placeholder="Введите ваш запрос"
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
};

Search.defaultProps = {
  isOpenSearch: false,
  setIsOpenSearch: () => {},
};

export default Search;
