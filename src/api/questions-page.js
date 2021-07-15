import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получить данные страницы
function getQuestionsPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/questions/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

// получить тагсы (список фильтров)
function getQuestionsPageTags() {
  return axios
    .get(`${baseURL}${apiUrl}/questions/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

// получить вопросы по фильтрам
function getQuestionsByFilters(query) {
  return axios
    .get(`${baseURL}${apiUrl}/questions/?tags=${query}`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err?.response));
}

// постинг вопроса
function postQuestion(question) {
  return axios
    .post(`${baseURL}${apiUrl}/questions/`, question)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

export {
  getQuestionsPageData,
  getQuestionsPageTags,
  getQuestionsByFilters,
  postQuestion,
};
