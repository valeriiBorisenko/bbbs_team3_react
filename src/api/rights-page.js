import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получение всех "прав" на странице Права
function getRightsData({ limit, offset, tags }) {
  return axios
    .get(`${baseURL}${apiUrl}/rights/`, {
      params: { tags, limit, offset },
    })
    .then((response) => response.data);
}

// получение категорий прав (список фильтров)
function getRightsTags() {
  return axios
    .get(`${baseURL}${apiUrl}/rights/tags/`)
    .then((response) => response.data);
}

export { getRightsData, getRightsTags };