import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getPlacesTags() {
  return axios
    .get(`${baseURL}${apiUrl}/places/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// python was here
// eslint-disable-next-line camelcase
function getPlaces({ chosen, tags, min_age, max_age }) {
  return axios
    .get(`${baseURL}${apiUrl}/places/`, {
      params: chosen
        ? { chosen, tags, min_age, max_age }
        : { tags, min_age, max_age },
    })
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

function postPlace(data) {
  return axios
    .post(`${baseURL}${apiUrl}/places/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

function getActivityTypes() {
  return axios
    .get(`${baseURL}${apiUrl}/places/activity-types/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getPlacesTags, getPlaces, postPlace, getActivityTypes };
