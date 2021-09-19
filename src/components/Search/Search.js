import './Search.scss';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SearchButton, Loader } from '../utils/index';
import { useFormWithValidation, useLocalStorage } from '../../hooks/index';
import search from '../../api/search';
import { CATALOG_URL, RIGHTS_URL } from '../../config/routes';
import { CurrentUserContext } from '../../contexts';
import { localStUserCity } from '../../config/constants';

function Search({
  isOpenSearch,
  setIsOpenSearch,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const getLocalStorageItem = useLocalStorage(localStUserCity);
  const currentAnonymousCity = getLocalStorageItem();
  const userCity = currentUser?.city ?? currentAnonymousCity;

  const { values, handleChange, resetForm } = useFormWithValidation();
  const [searchValue, setSearchValue] = useState([]);
  const [isVoidSearch, setIsVoidSearch] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [timer, setTimer] = useState(null);

  const getPathName = (url, id) => {
    if (`/${url}` === RIGHTS_URL) return `/${url}/${id}`;
    if (`/${url}` === CATALOG_URL) return `/${url}/${id}`;
    return `/${url}`;
  };

  const handleClickButton = () => {
    setIsOpenSearch(!isOpenSearch);
    resetForm();
    setSearchValue([]);
    setIsVoidSearch(false);
  };

  const handleClickLink = () => {
    setIsOpenSearch(!isOpenSearch);
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
            <li key={item.page + item.id} className="search__option-item">
              <Link
                onClick={handleClickLink}
                to={{
                  pathname: getPathName(item.page, item.id),
                  state: { id: item.id },
                }}
                className="search__title-link section-title section-title_clickable"
              >
                {item.title}
              </Link>
              <Link
                to={`/${item.page}`}
                className="link search__link"
                onClick={handleClickLink}
              >
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
        const currentRequest =
          userCity && !currentUser
            ? search({
                text: values.search,
                city: userCity,
              })
            : search({
                text: values.search,
              });
        const { count, results } = await currentRequest;
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
