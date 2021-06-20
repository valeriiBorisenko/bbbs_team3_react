import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import AuthApi from '../utils/auth';
import { MAIN_PAGE_URL } from '../config/routes';

const useAuth = ({ setCurrentUser, closeAllPopups }) => {
  const history = useHistory();

  const handleLogout = useCallback(() => {
    AuthApi.clearAuth();
    setCurrentUser(null);
    localStorage.removeItem('jwt');
    history.push(MAIN_PAGE_URL);
  }, []);

  const handleLogin = ({ login, password }) => {
    AuthApi.authorize(login, password)
      .then((data) => {
        const { access, refresh } = data.token;
        if (refresh && access) {
          AuthApi.setAuth(access);
          localStorage.setItem('jwt', access);
          AuthApi.getUserData()
            .then((userData) => {
              setCurrentUser(userData.userData);
            })
            .then(() => closeAllPopups())
            .catch(console.log); // при получении данных произошла ошибка
        }
      })
      .catch(console.log); // авторизация (работа с сервером) закончилась ошибкой
  };

  return {
    handleLogout,
    handleLogin
  };
};
export default useAuth;
