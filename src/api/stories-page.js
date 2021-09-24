import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получение списка историй (список фильтров)
function getStoriesPageTags({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/history/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

function getStoryById(id) {
  return axios
    .get(`${baseURL}${apiUrl}/history/${id}/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

export { getStoriesPageTags, getStoryById };
