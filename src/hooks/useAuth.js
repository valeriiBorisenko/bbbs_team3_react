import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PopupsContext, ErrorsContext } from '../contexts/index';
import AuthApi from '../api/auth';
import { getUserData } from '../api/user';
import { MAIN_PAGE_URL } from '../config/routes';
import {
  setLocalStorageData,
  getLocalStorageData,
  clearLocalStorage,
} from './useLocalStorage';
import { jwt } from '../config/constants';

const useAuth = (setCurrentUser) => {
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // не деструктурируется, на момент чтения undefined
  const popups = useContext(PopupsContext);
  const errors = useContext(ErrorsContext);

  const history = useHistory();

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
          getUserData()
            .then((res) => setCurrentUser(res))
            .then(() => popups.closeAllPopups())
            .catch((err) => errors.setError({ message: err })); // при получении данных произошла ошибка
        }
      })
      .catch((err) => errors.setError({ message: err })); // авторизация (работа с сервером) закончилась ошибкой
  };

  const checkToken = () => {
    const token = getLocalStorageData(jwt);
    if (token) {
      AuthApi.setAuth(token);
      getUserData()
        .then((res) => setCurrentUser(res))
        .then(() => setIsCheckingToken(false))
        .catch((error) => console.log(error)); // при получении userData возникла проблема
    } else {
      setIsCheckingToken(false);
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
