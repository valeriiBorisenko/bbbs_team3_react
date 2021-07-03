import './PopupCities.scss';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { CurrentUserContext, CitiesContext } from '../../../contexts/index';
import { Popup, TitleH2 } from './index';
import { updateUserProfile } from '../../../api/user';
import { localStUserCity } from '../../../config/constants';
import { dispatchLocalStorageEvent } from '../../../hooks/useLocalStorage';

function PopupCities({ isOpen, onClose }) {
  const { currentUser, updateUser } = useContext(CurrentUserContext);
  const cities = useContext(CitiesContext);

  function handleSubmit(event) {
    event.preventDefault();

    const cityId = parseInt(event.nativeEvent.submitter.value, 10);
    if (currentUser) {
      updateUserProfile({ city: cityId })
        .then((res) => {
          updateUser(res);
          onClose();
        })
        .catch(console.log);
    } else {
      dispatchLocalStorageEvent(localStUserCity, cityId);
      onClose();
    }
  }

  return (
    cities && (
      <Popup
        type="cities"
        typeContainer="cities"
        isOpen={isOpen}
        withoutCloseButton
      >
        <form className="popup__form" onSubmit={handleSubmit}>
          <TitleH2 title="Выберите ваш город" sectionClass="cities__title" />
          <div className="cities__container">
            <ul className="cities__list cities__list_type_primary">
              {cities &&
                cities
                  .filter((item) => item.isPrimary === true)
                  .map((item) => (
                    <li className="cities__list-item" key={item.id}>
                      <button
                        className="cities__city"
                        type="submit"
                        value={item.id}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
            </ul>
            <ul className="cities__list">
              {cities &&
                cities
                  .filter((item) => item.isPrimary !== true)
                  .map((item) => (
                    <li className="cities__list-item" key={item.id}>
                      <button
                        className="cities__city"
                        type="submit"
                        value={item.id}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
            </ul>
          </div>
        </form>
      </Popup>
    )
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
