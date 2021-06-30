import { useEffect, useState } from 'react';
import { getActivityTypes } from '../api/places-page';

const useActivityTypes = () => {
  const [activityTypes, setActivityTypes] = useState(null);

  useEffect(() => {
    getActivityTypes().then(setActivityTypes).catch(console.log);
  }, []);

  return activityTypes;
};

export default useActivityTypes;
