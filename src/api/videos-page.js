import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получение/фильтрация видео на странице "Видео"
function getVideoPageData({ limit, offset, tags }) {
  return axios
    .get(`${baseURL}${apiUrl}/videos/`, {
      params: { limit, offset, tags },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получение категорий видео (список фильтров)
function getVideoPageTags() {
  return axios
    .get(`${baseURL}${apiUrl}/videos/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getVideoPageTags, getVideoPageData };
