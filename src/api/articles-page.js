import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getArticlesPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/articles/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

function getArticleById(id) {
  return axios
    .get(`${baseURL}${apiUrl}/articles/${id}/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

export { getArticlesPageData, getArticleById };
