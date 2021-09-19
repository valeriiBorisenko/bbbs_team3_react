import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

const search = ({ text = '', city }) =>
  axios
    .get(`${baseURL}${apiUrl}/search/`, {
      params: { text, city },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));

export default search;
