import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
const MockAdapter = require('axios-mock-adapter');

const baseURL = 'http://localhost:3000';
const apiUrl = '/api/v1';

// файлы с серверными ответами
const mainPageData = require('./server-responses/main-page.json');
const profileDiaryData = require('./server-responses/profile-diary.json');
const cities = require('./server-responses/cities.json');
const calendarPageData = require('./server-responses/calendar-page.json');
const token = require('./server-responses/token.json');
const userData = require('./server-responses/userData.json');
const questionsData = require('./server-responses/questions-page.json');
const question = require('./server-responses/question-post.json');
const places = require('./server-responses/places.json');

// mock
const mock = new MockAdapter(axios, { delayResponse: 1000 });

export default function setMockedAnswers() {
  //! главная страница
  mock
    .onGet(`${baseURL}${apiUrl}/main/`)
    .reply(200, { mainPageData }, 'Content-Type: application/json');

  //! страница календаря
  mock
    .onGet(`${baseURL}${apiUrl}/afisha/events/`)
    .reply(200, { calendarPageData }, 'Content-Type: application/json');

  //! страница мест
  mock.onGet(`${baseURL}${apiUrl}/where-to-go/`).reply(200, places);

  //! Личный кабинет
  mock
    .onGet(`${baseURL}${apiUrl}/profile/diary/`)
    .reply(200, { profileDiaryData }, 'Content-Type: application/json');

  //! города
  mock
    .onGet(`${baseURL}${apiUrl}/cities/`)
    .reply(200, { cities }, 'Content-Type: application/json');

  //! логин и юзер-инфо
  mock
    .onPost(`${baseURL}${apiUrl}/token/`)
    .reply(200, { token }, 'Content-Type: application/json');

  mock
    .onGet(`${baseURL}${apiUrl}/profile/`)
    .reply(200, { userData }, 'Content-Type: application/json');

  const updateUserInfo = (incoming) => {
    const newUserData = JSON.parse(incoming.data);
    return [200, newUserData];
  };
  mock.onPatch(`${baseURL}${apiUrl}/profile/`).reply(updateUserInfo);

  //! работа с ивентами (карточками)
  const updateEventMock = (calendarCard) => {
    const calendarData = JSON.parse(calendarCard.data);
    calendarData.booked = !calendarData.booked;
    calendarData.seats = calendarData.booked ? calendarData.seats - 1 : calendarData.seats + 1;
    return [200, calendarData];
  };
  mock.onPatch(`${baseURL}${apiUrl}/afisha/event-participants/`).reply(updateEventMock);

  //! Страница Вопросы
  mock
    .onGet(`${baseURL}${apiUrl}/questions/`)
    .reply(200, questionsData, 'Content-Type: application/json');

  mock
    .onPost(`${baseURL}${apiUrl}/question/`)
    .reply(200, { question }, 'Content-Type: application/json');
}
