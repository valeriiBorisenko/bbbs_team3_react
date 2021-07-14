import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';
import mockArticleData from '../pages/CatalogArticle/CatalogArticle.json';

function getCatalogArticlePageData({ articleId } = {}) {
  if (articleId === 'mock') {
    return Promise.resolve({ result: mockArticleData });
  }
  return axios
    .get(`${baseURL}${apiUrl}/catalog/${articleId}`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export default getCatalogArticlePageData;
