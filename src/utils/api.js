import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
export default class Api {
  // главная страница
  //! подключено к бекенду
  static getMainPageData() {
    return axios
      .get(`${baseURL}${apiUrl}/main/`)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // города
  //! подключено к бекенду
  static getCities() {
    return axios
      .get(`${baseURL}${apiUrl}/cities/`)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // страница календаря (ивенты)
  // все ивенты
  //! подключено к бекенду
  static getCalendarPageData() {
    return axios
      .get(`${baseURL}${apiUrl}/afisha/events/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // все активные месяцы
  static getActiveMonthTags() {
    return axios
      .get(`${baseURL}${apiUrl}/afisha/events/months/`)
      .then((response) => response.data.months)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // ивенты по конкретному месяцу
  static getEventsByFilters(monthNumber) {
    return axios
      .get(`${baseURL}${apiUrl}/afisha/events/?months=${monthNumber}`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

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

  // работа с отдельными полями юзера
  //! подключено к бекенду
  static updateUseProfile(dataToUpdate) {
    return axios
      .patch(`${baseURL}${apiUrl}/profile/`, dataToUpdate)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

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

  // страница "куда пойти"
  static getPlacesTags() {
    return axios
      .get(`${baseURL}${apiUrl}/places/tags/`)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // python was here
  // eslint-disable-next-line camelcase
  static getPlaces({ chosen, tags, min_age, max_age }) {
    return axios
      .get(`${baseURL}${apiUrl}/places/`, {
        params: chosen
          ? { chosen, tags, min_age, max_age }
          : { tags, min_age, max_age },
      })
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static postPlace(data) {
    return axios
      .post(`${baseURL}${apiUrl}/places/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static getActivityTypes() {
    return axios
      .get(`${baseURL}${apiUrl}/places/activity-types/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  // работа со страницей справочника
  //! подключено к бекенду
  static getCatalogPageData({ limit, offset }) {
    return axios
      .get(`${baseURL}${apiUrl}/catalog/`, {
        params: { limit, offset },
      })
      .then((response) => response.data);
  }

  // работа со страницей вопросов
  //! подключено к бекенду
  static getQuestionsPageData() {
    return axios
      .get(`${baseURL}${apiUrl}/questions/`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static getQuestionsPageTags() {
    return axios
      .get(`${baseURL}${apiUrl}/questions/tags/`)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static getQuestionsByFilters(query) {
    return axios
      .get(`${baseURL}${apiUrl}/questions/?tags=${query}`)
      .then((response) => response.data.results)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
  }

  static postQuestion(question) {
    return axios
      .post(`${baseURL}${apiUrl}/questions/`, question)
      .then((response) => response.data)
      .catch((err) => Promise.reject(new Error(`${err.message}`)));
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
