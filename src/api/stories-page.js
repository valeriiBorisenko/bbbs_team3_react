import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получение списка историй (список фильтров)
function getStoriesPageTags() {
  return axios
    .get(`${baseURL}${apiUrl}/history/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

function getStoryById(id) {
  return axios
    .get(`${baseURL}${apiUrl}/history/${id}/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getStoriesPageTags, getStoryById };
