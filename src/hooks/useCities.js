import { useEffect, useState } from 'react';
import getCities from '../api/cities';
import { DEFAULT_CITY } from '../config/constants';

const useCities = () => {
  const [cities, setCities] = useState(null);
  const [defaultCity, setDefaultCity] = useState({});

  useEffect(() => {
    getCities()
      .then((citiesData) => {
        setCities(citiesData);
        const mainCity = citiesData.find((city) => city?.name === DEFAULT_CITY);
        setDefaultCity(mainCity);
      })
      .catch(console.error);
  }, []);

  return { cities, defaultCity };
};

export default useCities;
