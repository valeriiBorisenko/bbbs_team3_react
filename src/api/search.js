import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

const search = ({ text = '' }) =>
  axios
    .get(`${baseURL}${apiUrl}/search/`, {
      params: { text },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));

export default search;
