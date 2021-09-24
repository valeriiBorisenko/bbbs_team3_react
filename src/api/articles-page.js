import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getArticlesPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/articles/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получение одного книги
function getArticle(id) {
  return axios
    .get(`${baseURL}${apiUrl}/articles/${id}`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getArticlesPageData, getArticle };
