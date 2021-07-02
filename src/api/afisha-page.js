import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получить дату страницы
function getCalendarPageData() {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/events/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получить тегсы-месяцы (список фильтров)
function getActiveMonthTags() {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/events/months/`)
    .then((response) => response.data.months)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// фильтрация по конкретному месяцу
function getEventsByFilters(monthNumber) {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/events/?months=${monthNumber}`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getCalendarPageData, getActiveMonthTags, getEventsByFilters };
