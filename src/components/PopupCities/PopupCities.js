import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './PopupCities.scss';
import { getCities } from '../../utils/api';
import Popup from '../Popup/Popup';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupCities({ isOpen, onClose }) {
  const [cities, setCities] = useState(null);

  useEffect(() => {
    getCities()
      .then((res) => setCities(res.data.cities))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // TODO отправить запрос на сервер
    console.log(evt.nativeEvent.submitter.value);
    onClose();
  };

  return (
    cities && (
    <Popup
      type="cities"
      typeContainer="cities"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      withoutCloseButton
    >
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
    </Popup>
    )
  );
}

PopupCities.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

PopupCities.defaultProps = {
  isOpen: false,
  onClose: undefined
};

export default PopupCities;
