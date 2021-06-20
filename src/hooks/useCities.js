import { useEffect, useState } from 'react';
import Api from '../utils/api';

const useCities = () => {
  const [cities, setCities] = useState(null);

  useEffect(() => {
    Api.getCities()
      .then((res) => setCities(res.cities))
      .catch(console.log);
  }, []);

  return cities;
};

export default useCities;
