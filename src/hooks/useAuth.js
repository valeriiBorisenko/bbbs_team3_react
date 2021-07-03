import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthApi from '../api/auth';
import { getUserData } from '../api/user';
import { MAIN_PAGE_URL } from '../config/routes';
import {
  setLocalStorageData,
  removeLocalStorageData,
  getLocalStorageData,
} from './useLocalStorage';
import { jwt } from '../config/constants';

const useAuth = (setCurrentUser, closeAllPopups) => {
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const history = useHistory();

  const handleLogout = useCallback(() => {
    AuthApi.clearAuth();
    setCurrentUser(null);
    removeLocalStorageData(jwt);
    history.push(MAIN_PAGE_URL);
  }, []);

  const handleLogin = useCallback((loginData) => {
    AuthApi.authorize(loginData)
      .then((token) => {
        const { access, refresh } = token;
        if (refresh && access) {
          AuthApi.setAuth(access);
          setLocalStorageData(jwt, access);
          getUserData()
            .then((userData) => {
              setCurrentUser(userData.userData);
            })
            .then(() => closeAllPopups())
            .catch(console.log); // при получении данных произошла ошибка
        }
      })
      .catch(console.log); // авторизация (работа с сервером) закончилась ошибкой
  }, []);

  const checkToken = useCallback(() => {
    const token = getLocalStorageData(jwt);
    if (token) {
      AuthApi.setAuth(token);
      getUserData()
        .then((userData) => setCurrentUser(userData))
        .then(() => setIsCheckingToken(false))
        .catch((error) => console.log(error)); // при получении userData возникла проблема
    } else {
      setIsCheckingToken(false);
    }
  }, []);

  return {
    isCheckingToken,
    handleLogout,
    handleLogin,
    checkToken,
  };
};

export default useAuth;
