import axios from 'axios';
import { apiUrl, baseURL } from '../config/config';

function getProfileDiariesData() {
  return axios
    .get(`${baseURL}${apiUrl}/profile/diaries/`)
    .then((response) => response.data.results)
    .catch((err) => Promise.reject(err?.response));
}

// создать дневник
function createDiary(data) {
  return axios
    .post(`${baseURL}${apiUrl}/profile/diaries/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

// редактировать дневник
function editDiary(diaryId, data) {
  return axios
    .patch(`${baseURL}${apiUrl}/profile/diaries/${diaryId}/`, data)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

// удалить дневник
function deleteDiary(diaryId, data) {
  return axios
    .delete(`${baseURL}${apiUrl}/profile/diaries/${diaryId}/`, data)
    .then((response) => response.data)
    .catch((err) => Promise.reject(err?.response));
}

export { getProfileDiariesData, createDiary, editDiary, deleteDiary };
