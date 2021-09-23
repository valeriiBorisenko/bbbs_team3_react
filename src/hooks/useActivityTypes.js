import { useContext, useEffect, useState } from 'react';
import { getActivityTypes } from '../api/places-page';
import { ErrorsContext, PopupsContext } from '../contexts/index';
import { ERROR_MESSAGES } from '../config/constants';

const useActivityTypes = () => {
  const { generalErrorMessage } = ERROR_MESSAGES;
  // не деструктурируется, на момент чтения undefined
  const popups = useContext(PopupsContext);
  const errors = useContext(ErrorsContext);

  const [activityTypes, setActivityTypes] = useState(null);

  useEffect(() => {
    getActivityTypes()
      .then(setActivityTypes)
      .catch(() => {
        errors.setError(generalErrorMessage);
        popups.openPopupError();
      });
  }, []);

  return activityTypes;
};

export default useActivityTypes;
