import './SearchButton.scss';
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
    >
      <svg
        width="22"
        height="22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="9" cy="9.364" r="8" stroke="#000" />
        <path
          d="m14.999 15.364 5.333 5.333"
          stroke="#000"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

SearchButton.propTypes = {
  handleClickButton: PropTypes.func,
};

SearchButton.defaultProps = {
  handleClickButton: () => {},
};

export default SearchButton;
