import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

// получить юзера с сервера
function getUserData() {
  return axios
    .get(`${baseURL}${apiUrl}/profile/`)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

// обновить профиль пользователя
function updateUserProfile(dataToUpdate) {
  return axios
    .patch(`${baseURL}${apiUrl}/profile/`, dataToUpdate)
    .then((response) => response.data)
    .catch((err) => Promise.reject(new Error(`${err.message}`)));
}

export { getUserData, updateUserProfile };
