import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getPlacesTags() {
  return axios
    .get(`${baseURL}${apiUrl}/places/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

// python was here :)
// eslint-disable-next-line camelcase
function getPlaces({ chosen, tags, age_restriction, city, limit, offset }) {
  const query = chosen
    ? { city, chosen, tags, age_restriction, limit, offset }
    : { city, tags, age_restriction, limit, offset };
  return axios
    .get(`${baseURL}${apiUrl}/places/`, {
      params: query,
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

function getChosenPlace({ city }) {
  return axios
    .get(`${baseURL}${apiUrl}/places/first/`, {
      params: { city },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

function postPlace(data) {
  return axios
    .post(`${baseURL}${apiUrl}/places/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err?.response));
}

function getActivityTypes() {
  return axios
    .get(`${baseURL}${apiUrl}/places/activity-types/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err?.response));
}

// получение одного места
function getPlaceById(id) {
  return axios
    .get(`${baseURL}${apiUrl}/places/${id}/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

export {
  getPlacesTags,
  getPlaces,
  postPlace,
  getActivityTypes,
  getChosenPlace,
  getPlaceById,
};
