import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получить данные главной страницы
function getMainPageData() {
  return axios
    .get(`${baseURL}${apiUrl}/main/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export default getMainPageData;
