import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
export default class Api {
  // регистрация на мероприятие
  //! подключено к бекенду
  static makeEventRegistration(eventId) {
    console.log('registerOnEvent');
    return axios
      .post(`${baseURL}${apiUrl}/afisha/event-participants/`, eventId)
      .then((response) => console.log(response))
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // удаление регистрации на мероприятие
  //! подключено к бекенду
  static cancelEventRegistration(eventId) {
    console.log('registerOnEvent');
    console.log(eventId);
    return axios
      .delete(`${baseURL}${apiUrl}/afisha/event-participants/${eventId}/`)
      .then((response) => console.log(response))
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // ПЕРЕДЕЛАТЬ и отключить
  // работа со страницей ЛК
  //! подключено к бекенду
  static getBookedEvents() {
    return axios
      .get(`${baseURL}${apiUrl}/afisha/event-participants/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // получить дневник
  static getProfileDiariesData() {
    //! подключено к бекенду
    return axios
      .get(`${baseURL}${apiUrl}/profile/diaries/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // создать дневник
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

  // редактировать дневник
  static editDiary(diaryId, data) {
    //! подключено к бекенду
    return axios
      .patch(`${baseURL}${apiUrl}/profile/diaries/${diaryId}/`, data)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // удалить дневник
  static deleteDiary(diaryId, data) {
    //! подключено к бекенду
    return axios
      .delete(`${baseURL}${apiUrl}/profile/diaries/${diaryId}/`, data)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }
}
