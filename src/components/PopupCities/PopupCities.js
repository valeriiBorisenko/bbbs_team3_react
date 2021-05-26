import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './PopupCities.scss';
import { getCities } from '../../utils/api';
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
      <article className={`popup ${isOpen ? 'popup_opened' : ''}`}>
        <div className="popup__container popup__container_type_cities">
          <form className="cities" onSubmit={handleSubmit}>
            <TitleH2 title="Выберите ваш город" sectionClass="cities__title" />
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
          </form>
        </div>
      </article>
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
