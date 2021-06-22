import './SearchButton.scss';
import PropTypes from 'prop-types';

function SearchButton({ handleClick }) {
  return (
    <button
      className="search-button search__button"
      type="submit"
      aria-label="Поиск"
      title="Поиск"
      onClick={handleClick}
    />
  );
}

SearchButton.propTypes = {
  handleClick: PropTypes.func,
};

SearchButton.defaultProps = {
  handleClick: () => {},
};

export default SearchButton;
