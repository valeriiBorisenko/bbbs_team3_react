import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// работа со страницей фильмы
function getMoviesPageData({ limit, offset, tags }) {
  return axios
    .get(`${baseURL}${apiUrl}/movies/`, {
      params: { tags, limit, offset },
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

// получение одного видео
function getMovie(id) {
  return axios
    .get(`${baseURL}${apiUrl}/movies/${id}`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getMoviesPageData, getMoviesPageFilter, getMovie };
