import './PopupCities.scss';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import CurrentUserContext from '../../../contexts/CurrentUserContext';
import { Popup, TitleH2 } from './index';

function PopupCities({
  cities, isOpen, onClose, onSubmit
}) {
  const currentUser = useContext(CurrentUserContext);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const cityId = parseInt(evt.nativeEvent.submitter.value, 10);
    if (currentUser) {
      onSubmit({ ...currentUser, city: cityId });
    }
    onClose();
  };

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
            {cities
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
  cities: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

PopupCities.defaultProps = {
  cities: [],
  isOpen: false,
  onClose: () => {},
  onSubmit: () => {}
};

export default PopupCities;
