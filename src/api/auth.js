import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

class AuthApi {
  // установить заголовки авторизации
  static setAuth(accessToken) {
    axios.defaults.headers.get.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.post.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.patch.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.delete.Authorization = `Bearer ${accessToken}`;
  }

  // очистить заголовки авторизации
  static clearAuth() {
    axios.defaults.headers.get.Authorization = '';
    axios.defaults.headers.post.Authorization = '';
    axios.defaults.headers.delete.Authorization = '';
    axios.defaults.headers.patch.Authorization = '';
  }

  // функция авторизации
  static authorize(loginData) {
    return axios
      .post(`${baseURL}${apiUrl}/token/`, loginData)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }
}

export default AuthApi;
