const axios = require('axios');
// eslint-disable-next-line import/no-extraneous-dependencies
const MockAdapter = require('axios-mock-adapter');

//! data for server-responses
//! надо изменить нейминг
//! изменение нейминга тут влечет изменение на всех страницах сайта, где доступ к этим данным
const mainPageData = require('./server-responses/main-page.json');
const profileDiaryData = require('./server-responses/profile-diary.json');
const cities = require('./server-responses/cities.json');
const calendarPageData = require('./server-responses/calendar-page.json');
const token = require('./server-responses/token.json');
const userData = require('./server-responses/userData.json');

const baseURL = 'http://localhost:3000';
const apiUrl = '/api/v1';

// mock
const mock = new MockAdapter(axios, { delayResponse: 1000 });
//! templated server responses
// arguments for reply are (status, data, headers)
//! если отправлять просто как mainPageData без {} будет ошибка
mock.onGet(`${baseURL}${apiUrl}/main/`).reply(
  200,
  {
    mainPageData
  },
  'Content-Type: application/json'
);

mock.onGet(`${baseURL}${apiUrl}/profile/diary/`).reply(
  200,
  {
    profileDiaryData
  },
  'Content-Type: application/json'
);

mock.onGet(`${baseURL}${apiUrl}/cities/`).reply(
  200,
  {
    cities
  },
  'Content-Type: application/json'
);

mock.onGet(`${baseURL}${apiUrl}/afisha/events/`).reply(
  200,
  {
    calendarPageData
  },
  'Content-Type: application/json'
);

mock.onPost(`${baseURL}${apiUrl}/token/`).reply(
  200,
  {
    token
  },
  'Content-Type: application/json'
);

//! functions (new fetch-es)
// в режиме мок-адаптера все работает как (response) => response.data
// когда будет нормальный сервер надо будет делать как:
// (response) => response.json() + проверять статусы response и тогда возвращать res.json()
export const getMainPageData = () => axios.get(`${baseURL}${apiUrl}/main/`);
export const getProfileDiaryData = () => axios.get(`${baseURL}${apiUrl}/profile/diary/`).then((response) => response.data);
export const getCities = () => axios.get(`${baseURL}${apiUrl}/cities/`).then((response) => response.data);
export const getCalendarPageData = () => axios.get(`${baseURL}${apiUrl}/afisha/events/`).then((response) => response.data);

// login
//! один из методов auth
export const authorize = (loginData) => axios.post(`${baseURL}${apiUrl}/token/`, loginData).then((response) => response.data);

// фиксация заголовков, Headers -> Authorization
// ИЗ ТЗ: После авторизации во все запросы добавляем заголовок
// --header 'Authorization: Bearer "значение access"'
export const setAuth = (accessToken) => {
  axios.defaults.headers.get.Authorization = `Bearer ${accessToken}`;
  axios.defaults.headers.post.Authorization = `Bearer ${accessToken}`;
  console.log(axios.defaults.headers);
};

// жесткая фиксация заголовков 'Content-Type' на весь сеанс
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// очистка при логауте
export const clearAuth = () => {
  axios.defaults.headers.get.Authorization = '';
  axios.defaults.headers.post.Authorization = '';
  console.log(axios.defaults.headers);
};

// букд / не букд + обновление мест
// фетч-аксиос
export const updateEventFetch = (eventData) => axios.patch(`${baseURL}${apiUrl}/afisha/event-participants/`, eventData).then((response) => response.data);
// вспомогательная функция замоканного ответа
const updateEventMock = (calendarCard) => {
  const calendarData = JSON.parse(calendarCard.data);
  calendarData.booked = !calendarData.booked;
  calendarData.seats = calendarData.booked ? calendarData.seats - 1 : calendarData.seats + 1;
  return [200, calendarData];
};
// замоканный ответ
mock.onPatch(`${baseURL}${apiUrl}/afisha/event-participants/`).reply(updateEventMock);

// получение пользователя с сервера
//! один из методов auth
export const getUserData = () => axios.get(`${baseURL}${apiUrl}/profile/`).then((response) => response.data);
// замоканный ответ
mock.onGet(`${baseURL}${apiUrl}/profile/`).reply(
  200,
  {
    userData
  },
  'Content-Type: application/json'
);
