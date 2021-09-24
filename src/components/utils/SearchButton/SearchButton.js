import './SearchButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';

function SearchButton({ handleClickButton }) {
  return (
    <button
      className="search-button search__button"
      type="button"
      aria-label={texts.ariaLabelText}
      title={texts.ariaLabelText}
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
