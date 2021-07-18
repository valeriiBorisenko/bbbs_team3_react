import { useEffect, useState, useContext } from 'react';
import getCities from '../api/cities';
import { PopupsContext, ErrorsContext } from '../contexts/index';
import { DEFAULT_CITY, ERROR_MESSAGES } from '../config/constants';

const useCities = () => {
  const { generalErrorMessage } = ERROR_MESSAGES;
  // не деструктурируется, на момент чтения undefined
  const popups = useContext(PopupsContext);
  const errors = useContext(ErrorsContext);

  const [cities, setCities] = useState(null);
  const [defaultCity, setDefaultCity] = useState({});

  useEffect(() => {
    getCities()
      .then((citiesData) => {
        setCities(citiesData);
        const mainCity = citiesData.find((city) => city?.name === DEFAULT_CITY);
        setDefaultCity(mainCity);
      })
      .catch(() => {
        errors.setError({
          title: generalErrorMessage.title,
          button: generalErrorMessage.button,
        });
        popups.openPopupError();
      });
  }, []);

  return { cities, defaultCity };
};

export default useCities;
