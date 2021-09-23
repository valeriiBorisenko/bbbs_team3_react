import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getCatalogArticlePageData({ articleId } = {}) {
  return axios
    .get(`${baseURL}${apiUrl}/catalog/${articleId}`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

export default getCatalogArticlePageData;
