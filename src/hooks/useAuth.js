import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PopupsContext, ErrorsContext } from '../contexts/index';
import AuthApi from '../api/auth';
import { getUserData } from '../api/user';
import { MAIN_PAGE_URL } from '../config/routes';
import {
  setLocalStorageData,
  getLocalStorageData,
  removeLocalStorageData,
  clearLocalStorage,
} from './useLocalStorage';
import {
  jwt,
  jwtRefresh,
  ERROR_MESSAGES,
  ERROR_CODES,
} from '../config/constants';

const useAuth = (setCurrentUser) => {
  const { generalErrorMessage } = ERROR_MESSAGES;
  const { unauthorized, badRequest } = ERROR_CODES;

  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // не деструктурируется, на момент чтения undefined
  const popups = useContext(PopupsContext);
  const errors = useContext(ErrorsContext);

  const history = useHistory();

  const handleError = (err) => {
    if (err?.status === badRequest || err?.status === unauthorized)
      errors.setError(err?.data);
    else
      errors.setError({
        message: generalErrorMessage.title,
      });
  };

  const handleLogout = () => {
    AuthApi.clearAuth();
    setCurrentUser(null);
    clearLocalStorage();
    history.push(MAIN_PAGE_URL);
  };

  const handleLogin = (loginData) => {
    AuthApi.authorize(loginData)
      .then((token) => {
        const { access, refresh } = token;
        if (refresh && access) {
          AuthApi.setAuth(access);
          setLocalStorageData(jwt, access);
          setLocalStorageData(jwtRefresh, refresh);
          getUserData()
            .then((userData) => setCurrentUser(userData))
            .then(() => popups.closePopupLogin())
            .catch((err) => handleError(err));
        }
      })
      .catch((err) => handleError(err)); // авторизация (работа с сервером) закончилась ошибкой
  };

  const handleTokenError = () => {
    removeLocalStorageData(jwt);
    removeLocalStorageData(jwtRefresh);
    setIsCheckingToken(false);
  };

  const checkRefreshToken = (refresh) => {
    AuthApi.refreshToken({ refresh })
      .then(({ access }) => {
        AuthApi.setAuth(access);
        setLocalStorageData(jwt, access);
        getUserData()
          .then((userData) => setCurrentUser(userData))
          .catch((err) => handleError(err))
          .finally(() => setIsCheckingToken(false));
      })
      .catch(() => handleTokenError());
  };

  const checkToken = () => {
    const token = getLocalStorageData(jwt);
    const refreshToken = getLocalStorageData(jwtRefresh);
    if (token) {
      AuthApi.setAuth(token);
      getUserData()
        .then((userData) => {
          setCurrentUser(userData);
          setIsCheckingToken(false);
        })
        .catch((err) => {
          // токен просрочен
          AuthApi.clearAuth();
          if (err?.status === unauthorized && refreshToken) {
            checkRefreshToken(refreshToken);
          } else {
            handleTokenError();
          }
        });
    } else {
      handleTokenError();
    }
  };

  return {
    isCheckingToken,
    handleLogout,
    handleLogin,
    checkToken,
  };
};

export default useAuth;
