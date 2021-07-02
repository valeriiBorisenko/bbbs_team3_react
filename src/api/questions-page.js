import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получить данные страницы
function getQuestionsPageData() {
  return axios
    .get(`${baseURL}${apiUrl}/questions/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получить тагсы (список фильтров)
function getQuestionsPageTags() {
  return axios
    .get(`${baseURL}${apiUrl}/questions/tags/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получить вопросы по фильтрам
function getQuestionsByFilters(query) {
  return axios
    .get(`${baseURL}${apiUrl}/questions/?tags=${query}`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// постинг вопроса
function postQuestion(question) {
  return axios
    .post(`${baseURL}${apiUrl}/questions/`, question)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export {
  getQuestionsPageData,
  getQuestionsPageTags,
  getQuestionsByFilters,
  postQuestion,
};
