import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// работа со страницей книги
function getBooksPageData({ limit, offset, types }) {
  return axios
    .get(`${baseURL}${apiUrl}/books/`, {
      params: { types, limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// все активные теги (фильтры)
function getBooksPageFilter() {
  return axios
    .get(`${baseURL}${apiUrl}/books/types/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getBooksPageData, getBooksPageFilter };
