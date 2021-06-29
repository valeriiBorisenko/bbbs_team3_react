import axios from 'axios';
// import setMockedAnswers from './mocked-answers';
import { apiUrl, baseURL } from '../config/config';

// setMockedAnswers();

axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
export default class Api {
  // главная страница //! подключено к бекенду
  static getMainPageData() {
    return axios
      .get(`${baseURL}${apiUrl}/main/`)
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

  // страница календаря (ивенты) //! подключено к бекенду
  static getCalendarPageData() {
    return axios
      .get(`${baseURL}${apiUrl}/afisha/events/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // страница "куда пойти"
  static getPlaces() {
    return axios
      .get(`${baseURL}${apiUrl}/where-to-go/`) //! заменить /places
      .then((response) => response.data);
  }

  // регистрация на мероприятие  //! подключено к бекенду
  static makeEventRegistration(eventId) {
    console.log('registerOnEvent');
    return axios
      .post(`${baseURL}${apiUrl}/afisha/event-participants/`, eventId)
      .then((response) => console.log(response))
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // удаление регистрации на мероприятие //! подключено к бекенду
  static cancelEventRegistration(eventId) {
    console.log('registerOnEvent');
    console.log(eventId);
    return axios
      .delete(`${baseURL}${apiUrl}/afisha/event-participants/${eventId}/`)
      .then((response) => console.log(response))
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // работа с отдельными полями юзера
  static updateUseProfile(dataToUpdate) {
    //! подключено к бекенду
    return axios
      .patch(`${baseURL}${apiUrl}/profile/`, dataToUpdate)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // работа со страницей ЛК
  static getBookedEvents() {
    //! подключено к бекенду
    return axios
      .get(`${baseURL}${apiUrl}/afisha/event-participants/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static getProfileDiariesData() {
    //! подключено к бекенду
    return axios
      .get(`${baseURL}${apiUrl}/profile/diaries/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static createDiary(data) {
    //! подключено к бекенду
    return axios
      .post(`${baseURL}${apiUrl}/profile/diaries/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static editDiary(diaryId, data) {
    //! подключено к бекенду
    return axios
      .patch(`${baseURL}${apiUrl}/profile/diaries/${diaryId}/`, data)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static deleteDiary(diaryId, data) {
    //! подключено к бекенду
    return axios
      .delete(`${baseURL}${apiUrl}/profile/diaries/${diaryId}/`, data)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // работа со страницей справочника
  static getCatalogPageData({ limit, offset }) {
    return axios
      .get(`${baseURL}${apiUrl}/catalog/`, {
        params: { limit, offset },
      })
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

  // работа со страницей Права DATA
  static getRightsData({ limit, offset, tags }) {
    return axios
      .get(`${baseURL}${apiUrl}/rights/`, {
        params: { tags, limit, offset },
      })
      .then((response) => response.data);
  }

  // работа со страницей Права TAGS
  static getRightsTags() {
    return axios
      .get(`${baseURL}${apiUrl}/rights/tags/`)
      .then((response) => response.data);
  }
}
