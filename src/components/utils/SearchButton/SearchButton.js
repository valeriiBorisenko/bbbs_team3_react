import './SearchButton.scss';
import { useContext } from 'react';
import { PopupsContext } from '../../../contexts/index';

function SearchButton() {
  const { openPopupInfoTooltip } = useContext(PopupsContext);
  return (
    <button
      className="search-button search__button"
      type="button"
      aria-label="Поиск"
      title="Поиск"
      onClick={() => openPopupInfoTooltip()}
    />
  );
}

export default SearchButton;
