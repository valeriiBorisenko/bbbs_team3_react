import './SearchButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
// import { useContext } from 'react';
// import { PopupsContext } from '../../../contexts/index';

function SearchButton({ isOpenSearch, setIsOpenSearch }) {
  // const { openPopupInfoTooltip } = useContext(PopupsContext);
  return (
    <button
      className="search-button search__button"
      type="button"
      aria-label="Поиск"
      title="Поиск"
      onClick={() => setIsOpenSearch(!isOpenSearch)}
    />
  );
}

SearchButton.propTypes = {
  isOpenSearch: PropTypes.bool,
  setIsOpenSearch: PropTypes.func,
};

SearchButton.defaultProps = {
  isOpenSearch: false,
  setIsOpenSearch: () => {},
};

export default SearchButton;
