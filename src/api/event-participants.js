import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// запись на мероприятие
function makeEventRegistration(eventId) {
  return axios
    .post(`${baseURL}${apiUrl}/afisha/event-participants/`, eventId)
    .then((response) => console.log(response))
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// отписка регистрации на мероприятие
function cancelEventRegistration(eventId) {
  return axios
    .delete(`${baseURL}${apiUrl}/afisha/event-participants/${eventId}/`)
    .then((response) => console.log(response))
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получение списка всех мероприятий на которые записан юзер
function getBookedEvents() {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/event-participants/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

function getArchiveOfBookedEvents() {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/event-participants/archive/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export {
  makeEventRegistration,
  cancelEventRegistration,
  getBookedEvents,
  getArchiveOfBookedEvents,
};
