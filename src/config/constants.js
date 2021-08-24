export const weekdays = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
];

export const months = [
  '', // специально, т.к у бекенда с номера 1 начинается расчет месяцев
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

export const COLORS = [
  'yellow',
  'green',
  'yellow',
  'pink',
  'blue',
  'pink',
  'green',
  'yellow',
  'green',
  'blue',
  'pink',
  'blue',
];

export const FIGURES = [
  'square',
  'circle',
  'arch',
  'circle',
  'arch',
  'square',
  'arch',
  'square',
  'circle',
];

export const ALL_CATEGORIES = 'Все';
export const DEFAULT_CITY = 'Москва';

export const regExpImages = /^[\W\w\S\s]+\.(jpe?g|png|webp|jfif|bmp)$/i;

export const DELAY_DEBOUNCE = 400;
export const DELAY_RENDER = 100;

export const localStUserCity = 'userCity';
export const localStAfishaEvent = 'afishaEvent';
export const jwt = 'jwt';
export const jwtRefresh = 'jwtRefresh';
export const localStChosenVideo = 'chosenVideo';

export const ERROR_MESSAGES = {
  generalErrorMessage: {
    title: 'При передаче данных произошла ошибка. Повторите попытку позже.',
    button: 'Вернуться',
  },
  eventAddErrorMessage: {
    title: 'Что-то пошло не так, попробуйте записаться снова',
    button: 'Вернуться к мероприятию',
  },
  eventCancelErrorMessage: {
    title: 'Что-то пошло не так, попробуйте отписаться снова',
    button: 'Вернуться к мероприятию',
  },
  citiesErrorMessage: {
    title: 'Что-то пошло не так, попробуйте выбрать город снова',
    button: 'Вернуться',
  },
  filterErrorMessage: {
    title: 'Что-то пошло не так, попробуйте выбрать фильтр снова',
    button: 'Вернуться',
  },
};

export const ERROR_CODES = {
  badRequest: 400,
  unauthorized: 401,
};
