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

  function closePopup() {
    if (!currentUser && !getLocalStorageData(localStUserCity)) {
      dispatchLocalStorageEvent(localStUserCity, defaultCity?.id);
    }
    onClose();
  }

  function closePopupOnEsc(evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  }

  function submitCity(evt) {
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
  }

  const debounceSubmitCity = useDebounce(submitCity, DELAY_DEBOUNCE);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (defaultCity) {
      window.addEventListener('keyup', closePopupOnEsc);
      return () => window.removeEventListener('keyup', closePopupOnEsc);
    }
  }, [defaultCity]);

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
                .filter((item) => item?.isPrimary === true)
                .map((item) => (
                  <li className="cities__list-item" key={item?.id}>
                    <button
                      className="cities__city"
                      type="button"
                      value={item?.id}
                      onClick={(evt) => debounceSubmitCity(evt)}
                    >
                      {item?.name}
                    </button>
                  </li>
                ))}
          </ul>
          <ModificatedScrollbars horizontalScrollClass="scroll-thumb">
            <ul className="cities__list">
              {cities &&
                cities
                  .filter((item) => item?.isPrimary !== true)
                  .map((item) => (
                    <li className="cities__list-item" key={item?.id}>
                      <button
                        className="cities__city"
                        type="button"
                        value={item?.id}
                        onClick={(evt) => debounceSubmitCity(evt)}
                      >
                        {item?.name}
                      </button>
                    </li>
                  ))}
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
