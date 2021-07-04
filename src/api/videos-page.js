import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// работа со страницей видео
function getVideosPageData({ limit, offset }) {
  return axios
    .get(`${baseURL}${apiUrl}/videos/`, {
      params: { limit, offset },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export default getVideosPageData;
