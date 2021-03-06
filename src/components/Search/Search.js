import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import texts from './locales/RU';
import {
  CurrentUserContext,
  ErrorsContext,
  PopupsContext,
} from '../../contexts';
import {
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
  localStUserCity,
} from '../../config/constants';
import {
  AFISHA_URL,
  MOVIES_URL,
  QUESTIONS_URL,
  VIDEO_URL,
} from '../../config/routes';
import { searchValidationSettings } from '../../config/validation-settings';
import { useDebounce, useFormWithValidation } from '../../hooks';
import { getLocalStorageData } from '../../hooks/useLocalStorage';
import { refineClassNames } from '../../utils/utils';
import search from '../../api/search';
import { CloseButton, Loader, Paragraph, SearchButton } from '../utils';
import './Search.scss';

function Search({
  isOpenSearch,
  setIsOpenSearch,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);

  // приоритет города у авторизованного, затем у выбранного на странице Куда пойти
  const currentAnonymousCity = getLocalStorageData(localStUserCity);
  const userCity = currentUser?.city ?? currentAnonymousCity;

  const { values, handleChange, resetForm } = useFormWithValidation();
  const [searchResults, setSearchResults] = useState([]);
  const [isVoidSearch, setIsVoidSearch] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const inputRef = useRef(null);

  const getPathName = (url, id) => {
    // переходы на страницы с попапами либо вопроса
    if (`/${url}` === AFISHA_URL) return `/${url}`;
    if (`/${url}` === MOVIES_URL) return `/${url}`;
    if (`/${url}` === VIDEO_URL) return `/${url}`;
    if (`/${url}` === QUESTIONS_URL) return `/${url}`;
    // остальные страницы имеют динамические роуты
    return `/${url}/${id}`;
  };

  const animateListItem = (idx) => ({
    opacity: '0',
    animation: `fade-in 0.5s ease-out ${idx / 12}s forwards`,
  });

  const animateLink = (idx) => ({
    opacity: '0',
    animation: `slide-in 0.5s ease-out ${idx / 10}s forwards`,
  });

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
    try {
      const searchParams = userCity
        ? { text: values.search, city: userCity }
        : { text: values.search };
      const currentRequest = search(searchParams);
      const { count, results } = await currentRequest;
      setSearchResults(results);
      setIsLoadingSearch(false);
      return count === 0 ? setIsVoidSearch(true) : setIsVoidSearch(false);
    } catch {
      setIsLoadingSearch(false);
      setError(ERROR_MESSAGES.generalErrorMessage);
      return openPopupError();
    }
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
    // автофокус при открытии поиска
    if (isOpenSearch && inputRef && inputRef.current) inputRef.current.focus();
  }, [isOpenSearch]);

  const classNames = {
    searchOptions: refineClassNames([
      'search__options',
      'menu__search-options',
      isOpenSearch ? 'search__options_visible' : '',
    ]),
  };

  return (
    <form
      className="search"
      name="search-form"
      onSubmit={(evt) => evt.preventDefault()}
    >
      <SearchButton
        isOpenSearch={isOpenSearch}
        handleClickButton={handleClickButton}
      />
      <div className={classNames.searchOptions}>
        <div className="search__container-input">
          <div className="search__input-wrap">
            <input
              ref={inputRef}
              type="text"
              name="search"
              placeholder=""
              maxLength={searchValidationSettings.search.maxLength}
              className="search__input paragraph"
              autoComplete="off"
              onChange={handleChange}
              value={values.search || ''}
            />
            <CloseButton
              sectionClass="search__close-button"
              onClick={handleClickButton}
            />
          </div>
          <span className="search__input-border" />
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
          {searchResults.map((item, idx) => (
            <li
              key={item.page + item.id}
              className="search__option-item"
              style={animateListItem(idx)}
            >
              <Link
                onClick={handleClickLink}
                to={{
                  pathname: getPathName(item.page, item.id),
                  state: { id: item.id },
                }}
                className="search__title-link"
                style={animateLink(idx)}
              >
                <Paragraph
                  sectionClass="search__title"
                  size="big"
                  content={item.title}
                />
              </Link>
              <Link
                to={`/${item.page}`}
                className="search__link"
                style={animateLink(idx)}
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
  setIsOpenSearch: undefined,
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: undefined,
};

export default Search;
