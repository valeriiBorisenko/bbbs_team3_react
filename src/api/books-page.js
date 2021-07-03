import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// работа со страницей книги
function getBooksPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/books/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// все активные теги (фильтры)
function getActiveBooksTags() {
  return axios
    .get(`${baseURL}${apiUrl}/books/types/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// фильмы по конкретному тегу
function getActualBooksForFilter(books) {
  return axios
    .get(`${baseURL}${apiUrl}/books/?types=${books}`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getBooksPageData, getActiveBooksTags, getActualBooksForFilter };
