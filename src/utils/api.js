import { dataMain } from './constants';

const axios = require('axios');
// eslint-disable-next-line import/no-extraneous-dependencies
const MockAdapter = require('axios-mock-adapter');

const server = axios.create({
  headers: {
    'Content-Type': 'application/json'
  } // Заголовок запроса
});
const mock = new MockAdapter(server);
const baseURL = 'http://localhost:3000/';

// arguments for reply are (status, data, headers)
mock.onGet(`${baseURL}/main/`).reply(200, {
  dataMain
});

const getMainPageData = () => server.get(`${baseURL}/main/`);

export default getMainPageData;
