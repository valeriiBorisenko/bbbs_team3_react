import axios from 'axios';
// import setMockedAnswers from './mocked-answers';
import { apiUrl, baseURL } from '../config/config';

// setMockedAnswers();

export default class AuthApi {
  static setAuth(accessToken) {
    axios.defaults.headers.get.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.post.Authorization = `Bearer ${accessToken}`;
  }

  // очистка при логауте
  static clearAuth() {
    axios.defaults.headers.get.Authorization = '';
    axios.defaults.headers.post.Authorization = '';
  }

  static authorize(loginData) {
    return axios
      .post(`${baseURL}${apiUrl}/token/`, loginData)
      .then((response) => response.data);
  }

  static getUserData() {
    return fetch('http://127.0.0.1/api/v1/profile/')
      .then((profileData) => console.log(profileData))
      .catch((error) => console.log('error', error));

    // return axios
    //   .get('http://127.0.0.1/api/v1/profile/')
    //   .then((profileData) => console.log(profileData))
    //   .catch((error) => console.log('error', error));
  }

  //! все ответы будут потом переписаны на res.ok ? res.json() : reject()
  // _handleResult(response) {
  //   response.ok ? (response.json()) : Promise.reject(`Ошибка ${res.status} ${res.statusText}`)
  // }
}
