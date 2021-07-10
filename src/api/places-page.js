import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getPlacesTags() {
  return axios
    .get(`${baseURL}${apiUrl}/places/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err));
}

// python was here :)
// eslint-disable-next-line camelcase
function getPlaces({ chosen, tags, age_restriction, city }) {
  return axios
    .get(`${baseURL}${apiUrl}/places/`, {
      params: chosen
        ? { city, chosen, tags, age_restriction }
        : { city, tags, age_restriction },
    })
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err));
}

function postPlace(data) {
  return axios
    .post(`${baseURL}${apiUrl}/places/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err?.response?.data));
}

function getActivityTypes() {
  return axios
    .get(`${baseURL}${apiUrl}/places/activity-types/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err));
}

export { getPlacesTags, getPlaces, postPlace, getActivityTypes };
