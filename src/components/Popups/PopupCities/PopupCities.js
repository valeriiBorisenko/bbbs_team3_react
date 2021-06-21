import './PopupCities.scss';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import CurrentUserContext from '../../../contexts/CurrentUserContext';
import { Popup, TitleH2 } from './index';
import Api from '../../../utils/api';

function PopupCities({ cities, isOpen, onClose, onSubmit }) {
  const currentUser = useContext(CurrentUserContext);

  function handleSubmit(event) {
    event.preventDefault();

    const cityId = parseInt(event.nativeEvent.submitter.value, 10);
    if (currentUser) {
      Api.updateUseProfile({ city: cityId })
        .then((updatedUser) => onSubmit({ ...currentUser, ...updatedUser }))
        .catch((error) => console.log(error));
    }
    onClose();
  }

  return (
    cities && (
      <Popup
        type="cities"
        typeContainer="cities"
        isOpen={isOpen}
        onClose={onClose}
        withoutCloseButton
      >
        <form className="popup__form" onSubmit={handleSubmit}>
          <TitleH2 title="Выберите ваш город" sectionClass="cities__title" />
          <div className="cities__container">
            <ul className="cities__list cities__list_type_primary">
              {cities
                .filter((item) => item.isPrimary === true)
                .map((item) => (
                  <li className="cities__list-item" key={item.id}>
                    <button className="cities__city" type="submit" value={item.id}>
                      {item.name}
                    </button>
                  </li>
                ))}
            </ul>
            <ul className="cities__list">
              {cities
                .filter((item) => item.isPrimary !== true)
                .map((item) => (
                  <li className="cities__list-item" key={item.id}>
                    <button className="cities__city" type="submit" value={item.id}>
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
  cities: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

PopupCities.defaultProps = {
  cities: [],
  isOpen: false,
  onClose: () => {},
  onSubmit: () => {},
};

export default PopupCities;
