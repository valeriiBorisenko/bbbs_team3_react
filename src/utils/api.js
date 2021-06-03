const axios = require('axios');
// eslint-disable-next-line import/no-extraneous-dependencies
const MockAdapter = require('axios-mock-adapter');
//! data for server-responses
const mainPageData = require('./server-responses/main-page.json');
const accountDiaryData = require('./server-responses/account-diary.json');
const cities = require('./server-responses/cities.json');
const calendarPageData = require('./server-responses/calendar-page.json');
const token = require('./server-responses/token.json');

const baseURL = 'http://localhost:3000';
const apiUrl = '/api/v1';

// mock
const mock = new MockAdapter(axios, { delayResponse: 1000 });
//! templated server responses
// arguments for reply are (status, data, headers)
mock.onGet(`${baseURL}${apiUrl}/main/`).reply(
  200,
  {
    mainPageData
  },
  'Content-Type: application/json'
);

mock.onGet(`${baseURL}${apiUrl}/account/`).reply(
  200,
  {
    calendarPageData
  },
  'Content-Type: application/json'
);

mock.onGet(`${baseURL}${apiUrl}/account/diary/`).reply(
  200,
  {
    accountDiaryData
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

// будущий user prifle reply
// mock.onGet(`${baseURL}${apiUrl}/profile/`).reply(
//   200,
//   {
//   },
//   'Content-Type: application/json'
// );

//! functions (new fetch-es)
// в режиме мок-адаптера все работает как (response) => response.data
// когда будет нормальный сервер надо будет делать как (response) => response.json()
export const getMainPageData = () => axios.get(`${baseURL}${apiUrl}/main/`);
export const getAccountData = () => axios.get(`${baseURL}${apiUrl}/account/`);
export const getAccountDiaryData = () => axios.get(`${baseURL}${apiUrl}/account/diary/`);
export const getCities = () => axios.get(`${baseURL}${apiUrl}/cities/`);
export const getCalendarPageData = () => axios.get(`${baseURL}${apiUrl}/afisha/events/`).then((response) => response.data);
// login
export const postUserDataOnLogin = (userData) => axios.post(`${baseURL}${apiUrl}/token/`, userData).then((response) => response.data);
// getUserData on login //! нужно замокать
export const getUserData = () => axios.get(`${baseURL}${apiUrl}/profile/`).then((response) => response.data);

// фиксация заголовков, Headers -> Authorization
export const setAuth = (accessToken) => {
  axios.defaults.headers.get.Authorization = `Bearer ${accessToken}`;
  axios.defaults.headers.post.Authorization = `Bearer ${accessToken}`;
  console.log(axios.defaults.headers);
};

export const clearAuth = () => {
  axios.defaults.headers.get.Authorization = '';
  axios.defaults.headers.post.Authorization = '';
  console.log(axios.defaults.headers);
};

// жесткая фиксация заголовков 'Content-Type'
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
