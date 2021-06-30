import { months, weekdays } from '../config/constants';

// форматирует секунды в часы, минуты и секунды, принимает на вход number
export const formatDuration = (duration) => {
  const hours = parseInt(duration / (60 * 60), 10);
  const minutes = parseInt((duration / 60) % 60, 10);
  const seconds = duration % 60;
  const format = (value) => (value < 10 ? `0${value}` : `${value}`);

  return {
    hours: format(hours),
    minutes: format(minutes),
    seconds: format(seconds),
  };
};

// форматирует дату в объект по разным ключам, принимает на вход string вида "2021-05-08T21:22:00Z"
export const formatDate = (date) => {
  const parsedDate = new Date(date);
  let day = parsedDate.getDate();
  const weekdayName = weekdays[parsedDate.getDay()];
  const monthName = months[parsedDate.getMonth() + 1]; // потому что months начинается с 1, а не 0
  const hour = String(parsedDate.getHours());
  const year = String(parsedDate.getFullYear());
  let minutes = parsedDate.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return {
    year,
    day,
    weekdayName,
    monthName,
    hour,
    minutes,
  };
};

// форматирует дату типа "2021-05-08T21:22:00Z" в 'YYYY/MM/DD'
export const parseDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return `${year}-${month}-${day}`;
};

// падеж слова "место" в зависимости от числа мест
// принимает на вход количество оставшихся мест из чего формирует падеж слова
// нужно в карточках, попапах
export const formatWordCase = (remainSeats) => {
  // если кончается на 1 - окончание О
  // если кончается на 2 3 4 - окончание A
  // если кончается на другое - окончания нет
  const lastDigit = remainSeats % 10;

  if (lastDigit === 1) {
    return 'место';
  }
  if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
    return 'местa';
  }
  return 'мест';
};

// вернет заголовок состоящий из тегов
// принимает массив тегов
export const getCardType = (tags) => {
  if (tags) {
    return tags.map((tag, idx) => {
      if (tags.length === 1) {
        return `${tag.name}`;
      }
      if (idx !== tags.length - 1) {
        return `${tag.name} + `;
      }
      return `${tag.name.toLowerCase()}`;
    });
  }
  return undefined;
};

export const questionForm = {
  before: {
    title:
      'Если вы не нашли ответ на свой вопрос — напишите нам, и мы включим его в список',
    sectionClass: '',
  },
  after: {
    title: 'Спасибо! Мы приняли ваш вопрос',
    sectionClass: 'question-form_invisible',
  },
};

// меняет в слове первую букву на заглавную
export const changeCaseOfFirstLetter = (str) => {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
};

// управление падежами месяцев
export const formatMonthsGenitiveCase = (month) => {
  if (month === 'март' || month === 'август') return `${month}а`;
  return `${month.slice(0, -1)}я`;
};

export const randomizeArray = (arr, size) => {
  if (arr && size < arr.length) {
    const array = arr.slice();
    return [...Array(size)].map(
      () => array.splice(Math.floor(Math.random() * array.length), 1)[0]
    );
  }
  return arr;
};
