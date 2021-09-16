import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получить дату страницы
function getCalendarPageData({ limit, offset, months }) {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/events/`, {
      params: { limit, offset, months },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получить тегсы-месяцы (список фильтров)
function getActiveMonthTags() {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/events/months/`)
    .then((response) => response.data.months)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// получение одного события
function getCalendarItem(id) {
  return axios
    .get(`${baseURL}${apiUrl}/afisha/events/${id}`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getCalendarPageData, getActiveMonthTags, getCalendarItem };
