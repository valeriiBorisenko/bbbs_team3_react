import axios from 'axios';
// import setMockedAnswers from './mocked-answers';
import { apiUrl, baseURL } from '../config/config';

// setMockedAnswers();

axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
export default class Api {
  // главная страница //! подключено к бекенду
  static getMainPageData() {
    return axios.get(`${baseURL}${apiUrl}/main/`)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // города //! подключено к бекенду
  static getCities() {
    return axios
      .get(`${baseURL}${apiUrl}/cities/`)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // страница календаря (ивенты)
  static getCalendarPageData() {
    return axios
      .get(`${baseURL}${apiUrl}/afisha/events/`)
      .then((response) => response.data);
  }

  // страница "куда пойти"
  static getPlaces() {
    return axios
      .get(`${baseURL}${apiUrl}/where-to-go/`) //! заменить /places
      .then((response) => response.data);
  }

  // работа с ивентами (карточки)
  static updateEvent(eventData) {
    return axios
      .patch(`${baseURL}${apiUrl}/afisha/event-participants/`, eventData)
      .then((response) => response.data);
  }

  // работа с юзером
  static updateUserInfo(userData) {
    return axios
      .patch(`${baseURL}${apiUrl}/profile/`, userData)
      .then((response) => response.data);
  }

  // работа со страницей ЛК
  static getProfileDiaryData() {
    return axios
      .get(`${baseURL}${apiUrl}/profile/diary/`)
      .then((response) => response.data);
  }

  // работа со странице вопросов
  static getQuestionsPageData() {
    return axios
      .get(`${baseURL}${apiUrl}/questions/`)
      .then((response) => response.data);
  }

  static postQuestion(question) {
    return axios
      .post(`${baseURL}${apiUrl}/question/`, question)
      .then((response) => response.data);
  }
}
