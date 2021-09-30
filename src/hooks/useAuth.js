import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ErrorsContext, PopupsContext } from '../contexts/index';
import AuthApi from '../api/auth';
import { getUserData } from '../api/user';
import { MAIN_PAGE_URL } from '../config/routes';
import {
  clearLocalStorage,
  getLocalStorageData,
  removeLocalStorageData,
  setLocalStorageData,
} from './useLocalStorage';
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  jwt,
  jwtRefresh,
} from '../config/constants';

const useAuth = (setCurrentUser) => {
  const { unauthorized, badRequest } = ERROR_CODES;

  const [isCheckingToken, setIsCheckingToken] = useState(true);
  // для попапа логина
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  // не деструктурируется, на момент чтения undefined
  const popups = useContext(PopupsContext);
  const errors = useContext(ErrorsContext);

  const history = useHistory();

  const handleError = (err) => {
    if (err?.status === badRequest || err?.status === unauthorized)
      errors.setError(err?.data);
    else errors.setError(ERROR_MESSAGES.generalErrorMessage);
  };

  const handleLogout = () => {
    AuthApi.clearAuth();
    setCurrentUser(null);
    clearLocalStorage();
    history.push(MAIN_PAGE_URL);
  };

  const handleLogin = (loginData) => {
    setIsWaitingResponse(true);
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
            .catch((err) => handleError(err))
            .finally(() => setIsWaitingResponse(false));
        } else {
          throw new Error(ERROR_MESSAGES.generalErrorMessage.title);
        }
      })
      .catch((err) => handleError(err)) // авторизация (работа с сервером) закончилась ошибкой
      .finally(() => setIsWaitingResponse(false));
  };

  const handleTokenError = () => {
    AuthApi.clearAuth();
    removeLocalStorageData(jwt);
    removeLocalStorageData(jwtRefresh);
    setIsCheckingToken(false);
    setCurrentUser(null);
  };

  const checkRefreshToken = (refresh) => {
    AuthApi.refreshToken({ refresh })
      .then(({ access }) => {
        AuthApi.setAuth(access);
        setLocalStorageData(jwt, access);
        getUserData()
          .then((userData) => setCurrentUser(userData))
          .catch(() => handleTokenError())
          .finally(() => setIsCheckingToken(false));
      })
      .catch(() => handleTokenError());
  };

  // происходит фоном
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
    } else if (refreshToken) {
      checkRefreshToken(refreshToken);
    } else {
      handleTokenError();
    }
  };

  return {
    isCheckingToken,
    isWaitingResponse,
    handleLogout,
    handleLogin,
    checkToken,
  };
};

export default useAuth;
