import { useEffect, useState } from 'react';
import Api from '../utils/api';

const useActivityTypes = () => {
  const [activityTypes, setActivityTypes] = useState(null);

  useEffect(() => {
    Api.getActivityTypes()
      .then((res) =>
        setActivityTypes(() =>
          res.reduce((obj, { id, name }) => {
            // eslint-disable-next-line no-param-reassign
            obj[id] = name;
            return obj;
          }, {})
        )
      )
      .catch(console.log);
  }, []);

  return activityTypes;
};

export default useActivityTypes;
