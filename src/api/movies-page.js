import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// работа со страницей фильмы
function getMoviesPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/movies/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// все активные теги (фильтры)
function getMoviesPageFilter() {
  return axios
    .get(`${baseURL}${apiUrl}/movies/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// фильмы по конкретному тегу
function getActualMoviesPageFilter(movies) {
  return axios
    .get(`${baseURL}${apiUrl}/movies/?tags=${movies}`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getMoviesPageData, getMoviesPageFilter, getActualMoviesPageFilter };
