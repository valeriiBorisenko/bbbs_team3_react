import { useEffect, useState } from 'react';
import getCities from '../api/cities';

const useCities = () => {
  const [cities, setCities] = useState(null);

  useEffect(() => {
    getCities().then(setCities).catch(console.log);
  }, []);

  return cities;
};

export default useCities;
