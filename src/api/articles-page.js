import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getArticlesPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/articles/`, {
      params: { limit, offset },
    })
    .then((response) => response.data);
}

export default getArticlesPageData;
