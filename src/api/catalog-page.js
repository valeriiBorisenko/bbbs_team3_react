import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получить данные страницы каталога
function getCatalogPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/catalog/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

function getCatalogArticlePageData({ articleId } = {}) {
  return axios
    .get(`${baseURL}${apiUrl}/catalog/${articleId}`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

export { getCatalogPageData, getCatalogArticlePageData };
