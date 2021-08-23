import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получение всех "прав" на странице Права
function getRightsData({ limit, offset, tags }) {
  return axios
    .get(`${baseURL}${apiUrl}/rights/`, {
      params: { tags, limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получение категорий прав (список фильтров)
function getRightsTags() {
  return axios
    .get(`${baseURL}${apiUrl}/rights/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получение Статьи для страницы Права Детей
function getRightsArticle({ id, tags }) {
  return axios
    .get(`${baseURL}${apiUrl}/rights/${id}/`, {
      params: { tags },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getRightsData, getRightsTags, getRightsArticle };
