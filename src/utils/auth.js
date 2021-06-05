import axios from 'axios';
import setMockedAnswers from './mocked-answers';

const baseURL = 'http://localhost:3000';
const apiUrl = '/api/v1';

setMockedAnswers();

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
    return axios
      .get(`${baseURL}${apiUrl}/profile/`)
      .then((response) => response.data);
  }

  //! все ответы будут потом переписаны на res.ok ? res.json() : reject()
  // _handleResult(response) {
  //   response.ok ? (response.json()) : Promise.reject(`Ошибка ${res.status} ${res.statusText}`)
  // }
}
