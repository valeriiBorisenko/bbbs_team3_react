import axios from 'axios';
// import setMockedAnswers from './mocked-answers';
import { apiUrl, baseURL } from '../config/config';

// setMockedAnswers();

export default class AuthApi {
  static setAuth(accessToken) {
    //! подключено к бекенду
    axios.defaults.headers.get.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.post.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.patch.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.delete.Authorization = `Bearer ${accessToken}`;
  }

  // очистка при логауте
  static clearAuth() {
    //! подключено к бекенду
    console.log(axios.defaults.headers);
    axios.defaults.headers.get.Authorization = '';
    axios.defaults.headers.post.Authorization = '';
    axios.defaults.headers.delete.Authorization = '';
    axios.defaults.headers.patch.Authorization = '';
    console.log(axios.defaults.headers);
  }

  static authorize(loginData) {
    //! подключено к бекенду
    return axios
      .post(`${baseURL}${apiUrl}/token/`, loginData)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  //! может вынести отсюда в API
  static getUserData() {
    //! подключено к бекенду
    return axios
      .get(`${baseURL}${apiUrl}/profile/`)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }
}
