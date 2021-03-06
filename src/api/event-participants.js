import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// запись на мероприятие
function makeEventRegistration(eventId) {
  return axios
    .post(`${baseURL}${apiUrl}/afisha/event-participants/`, eventId)
    .then((response) => response)
    .catch((err) => Promise.reject(err?.response));
}

// отписка регистрации на мероприятие
function cancelEventRegistration(eventId) {
  return axios
    .delete(`${baseURL}${apiUrl}/afisha/event-participants/${eventId}/`)
    .then((response) => response)
    .catch((err) => Promise.reject(err?.response));
}

// получение списка всех мероприятий на которые записан юзер
function getBookedEvents({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/event-participants/`, {
      params: { limit, offset },
    })
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err?.response));
}

function getArchiveOfBookedEvents({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/event-participants/archive/`, {
      params: { limit, offset },
    })
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err?.response));
}

export {
  makeEventRegistration,
  cancelEventRegistration,
  getBookedEvents,
  getArchiveOfBookedEvents,
};
