import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import {
  CurrentUserContext,
  CitiesContext,
  ErrorsContext,
  PopupsContext,
} from '../../../contexts/index';
import { updateUserProfile } from '../../../api/user';
import {
  localStUserCity,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
} from '../../../config/constants';
import {
  dispatchLocalStorageEvent,
  getLocalStorageData,
} from '../../../hooks/useLocalStorage';
import { useDebounce } from '../../../hooks/index';
import Popup from '../Popup/Popup';
import { TitleH2, ModificatedScrollbars } from '../../utils/index';
import './PopupCities.scss';

function PopupCities({ isOpen, onClose }) {
  const { currentUser, updateUser } = useContext(CurrentUserContext);
  const { cities, defaultCity } = useContext(CitiesContext);
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);

  const currentUserCity =
    currentUser?.city || getLocalStorageData(localStUserCity);

  function closePopup() {
    if (!currentUser && !getLocalStorageData(localStUserCity)) {
      dispatchLocalStorageEvent(localStUserCity, defaultCity?.id);
    }
    onClose();
  }

  const closePopupOnEsc = (evt) => {
    if (evt.key === 'Escape') {
      closePopup();
    }
  };

  const submitCity = (evt) => {
    const cityId = parseInt(evt.target.value, 10);
    if (currentUser) {
      updateUserProfile({ city: cityId })
        .then((res) => {
          updateUser(res);
          onClose();
        })
        .catch(() => {
          setError({
            title: ERROR_MESSAGES.citiesErrorMessage.title,
            button: ERROR_MESSAGES.citiesErrorMessage.button,
          });
          openPopupError();
        });
    } else {
      dispatchLocalStorageEvent(localStUserCity, cityId);
      onClose();
    }
  };

  const debounceSubmitCity = useDebounce(submitCity, DELAY_DEBOUNCE);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (defaultCity) {
      window.addEventListener('keyup', closePopupOnEsc);
      return () => window.removeEventListener('keyup', closePopupOnEsc);
    }
  }, [defaultCity]);

  const renderCityItem = (city) => (
    <li className="cities__list-item" key={city?.id}>
      <button
        className={`cities__city ${
          currentUserCity === city?.id ? 'cities__city_current' : ''
        }`}
        type="button"
        value={city?.id}
        onClick={(evt) => debounceSubmitCity(evt)}
      >
        {city?.name}
      </button>
    </li>
  );

  return (
    <Popup
      type="cities"
      typeContainer="cities"
      isOpen={isOpen}
      onClose={closePopup}
      withoutCloseButton
    >
      <div className="popup__form">
        <TitleH2 title={texts.title} sectionClass="cities__title" />
        <div className="cities__container">
          <ul className="cities__list cities__list_type_primary">
            {cities &&
              cities
                .filter((city) => city?.isPrimary === true)
                .map((city) => renderCityItem(city))}
          </ul>
          <ModificatedScrollbars horizontalScrollClass="scroll-thumb">
            <ul className="cities__list">
              {cities &&
                cities
                  .filter((city) => city?.isPrimary !== true)
                  .map((city) => renderCityItem(city))}
            </ul>
          </ModificatedScrollbars>
        </div>
      </div>
    </Popup>
  );
}

PopupCities.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupCities.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupCities;
