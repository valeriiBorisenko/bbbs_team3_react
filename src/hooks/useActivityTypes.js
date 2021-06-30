import { useEffect, useState } from 'react';
import Api from '../utils/api';

const useActivityTypes = () => {
  const [activityTypes, setActivityTypes] = useState(null);

  useEffect(() => {
    Api.getActivityTypes().then(setActivityTypes).catch(console.log);
  }, []);

  return activityTypes;
};

export default useActivityTypes;
