const axios = require('axios');
// eslint-disable-next-line import/no-extraneous-dependencies
const MockAdapter = require('axios-mock-adapter');

const mainPageData = require('./server-responses/main-page.json');

const accountData = require('./server-responses/account.json');

const calendarPageData = require('./server-responses/calendar-page.json');


const baseURL = 'http://localhost:3000';

// mock
const mock = new MockAdapter(axios, { delayResponse: 3000 });
// arguments for reply are (status, data, headers)
mock.onGet(`${baseURL}/main/`).reply(
  200,
  {
    mainPageData
  },
  'Content-Type: application/json'
);

mock.onGet(`${baseURL}/account/`).reply(
  200,
  {
    accountData
  },
  'Content-Type: application/json'
);

mock.onGet(`${baseURL}/afisha/events/`).reply(
  200,
  {
    calendarPageData
  },
  'Content-Type: application/json'
);

mock.onPut(`${baseURL}/afisha/events/:id`).reply(
  200,
  {
    booked: true
  },
  'Content-Type: application/json'
);

mock.onDelete(`${baseURL}/afisha/events/:id`).reply(
  200,
  {
    booked: false
  },
  'Content-Type: application/json'
);

// functions
export const getMainPageData = () => axios.get(`${baseURL}/main/`);
export const getCalendarPageData = () => axios.get(`${baseURL}/afisha/events/`);
export const putBookedEvent = () => axios.put(`${baseURL}/afisha/events/:id}`);
export const deleteBookedEvent = () => axios.put(`${baseURL}/afisha/events/:id}`);
