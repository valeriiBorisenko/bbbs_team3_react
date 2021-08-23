import './SearchButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
// import { useContext } from 'react';
// import { PopupsContext } from '../../../contexts/index';

function SearchButton({ handleClickButton }) {
  // const { openPopupInfoTooltip } = useContext(PopupsContext);
  return (
    <button
      className="search-button search__button"
      type="button"
      aria-label="Поиск"
      title="Поиск"
      onClick={handleClickButton}
    />
  );
}

SearchButton.propTypes = {
  handleClickButton: PropTypes.func,
};

SearchButton.defaultProps = {
  handleClickButton: () => {},
};

export default SearchButton;
