import './Search.scss';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import texts from './locales/RU';
import { Loader, SearchButton } from '../utils';
import { useDebounce, useFormWithValidation } from '../../hooks';
import { getLocalStorageData } from '../../hooks/useLocalStorage';
import search from '../../api/search';
import { CATALOG_URL, RIGHTS_URL, STORIES_URL } from '../../config/routes';
import { CitiesContext, CurrentUserContext } from '../../contexts';
import { DELAY_DEBOUNCE, localStUserCity } from '../../config/constants';

function Search({
  isOpenSearch,
  setIsOpenSearch,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const { defaultCity } = useContext(CitiesContext);

  // приоритет города у авторизованного, затем у выбранного на странице Куда пойти и затем уже по умолчанию
  const currentAnonymousCity = getLocalStorageData(localStUserCity);
  const userCity = currentUser?.city ?? currentAnonymousCity ?? defaultCity?.id;

  const { values, handleChange, resetForm } = useFormWithValidation();
  const [searchResults, setSearchResults] = useState([]);
  const [isVoidSearch, setIsVoidSearch] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const getPathName = (url, id) => {
    if (`/${url}` === RIGHTS_URL) return `/${url}/${id}`;
    if (`/${url}` === CATALOG_URL) return `/${url}/${id}`;
    if (`/${url}` === STORIES_URL) return `/${url}/${id}`;
    return `/${url}`;
  };

  const handleClickButton = () => {
    setIsOpenSearch(!isOpenSearch);
    resetForm();
    setSearchResults([]);
    setIsVoidSearch(false);
  };

  const handleClickLink = () => {
    setIsOpenSearch(!isOpenSearch);
  };

  const handleSearchRequest = async () => {
    const currentRequest = search({ text: values.search, city: userCity });
    const { count, results } = await currentRequest;
    setSearchResults(results);
    setIsLoadingSearch(false);
    return count === 0 ? setIsVoidSearch(true) : setIsVoidSearch(false);
  };

  const handleDebouncedRequest = useDebounce(
    handleSearchRequest,
    DELAY_DEBOUNCE
  );

  useEffect(() => {
    // проверка на пустой запрос и запрос из пробелов
    if (values.search && values.search.trim()) {
      setIsLoadingSearch(true);
      handleDebouncedRequest();
    }
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
            aria-label={texts.ariaLabelCloseButton}
            className="search__close-button"
            onClick={handleClickButton}
          />
        </div>

        {renderSearchContent()}
      </div>
    </form>
  );

  function renderSearchItems() {
    if (isVoidSearch)
      return <p className="search__content_type_void">{texts.notFoundText}</p>;

    if (searchResults.length > 0) {
      return (
        <ul className="search__option-list">
          {searchResults.map((item) => (
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
                {item.modelName.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
      );
    }

    return <p className="search__content_type_ask">{texts.searchText}</p>;
  }

  function renderSearchContent() {
    return isLoadingSearch ? <Loader isNested /> : renderSearchItems();
  }
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
