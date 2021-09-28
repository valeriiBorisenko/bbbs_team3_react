import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ERROR_CODES } from '../config/constants';
import { NOT_FOUND_URL } from '../config/routes';

const useSingleCardAtDynamicRoute = ({
  apiCallback,
  dynamicParam,
  setIsPageError,
}) => {
  const history = useHistory();

  // стейт для одиночной карточки (при переходе по id)
  const [singleCard, setSingleCard] = useState(null);
  // чтобы показать карточку, нужно её ещё загрузить
  const isSingleCardShown = !!(singleCard && dynamicParam);

  useEffect(() => {
    if (dynamicParam) {
      apiCallback(dynamicParam)
        .then(setSingleCard)
        .catch((err) => {
          if (err.status === ERROR_CODES.notFound) history.push(NOT_FOUND_URL);
          else setIsPageError(true);
        });
    }
  }, [dynamicParam]);

  return {
    isSingleCardShown,
    singleCard,
  };
};

export default useSingleCardAtDynamicRoute;
