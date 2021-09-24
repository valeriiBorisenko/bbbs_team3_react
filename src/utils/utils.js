import { months, weekdays } from '../config/constants';

// форматирует секунды в часы, минуты и секунды, принимает на вход number
export const formatDuration = (duration) => {
  const hours = Math.floor(duration / (60 * 60));
  const minutes = Math.floor((duration / 60) % 60);
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
  let month = parsedDate.getMonth() + 1;
  const weekdayName = weekdays[parsedDate.getDay()];
  const monthName = months[parsedDate.getMonth()];
  const hour = String(parsedDate.getHours());
  const year = String(parsedDate.getFullYear());
  let minutes = parsedDate.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  if (month < 10) {
    month = `0${month}`;
  }

  return {
    year,
    day,
    month,
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
  // промежуток 11 - 14
  const lastTwoDigits = remainSeats % 100;
  if (lastTwoDigits > 10 && lastTwoDigits < 15) {
    return 'мест';
  }
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

// меняет в слове первую букву на заглавную
export const changeCaseOfFirstLetter = (str) => {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
};

// управление падежами месяцев
export const formatMonthsGenitiveCase = (month) => {
  if (month) {
    if (month === 'март' || month === 'август') return `${month}а`;
    return `${month.slice(0, -1)}я`;
  }
  return month;
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

export const formatPhoneNumber = (phoneNum) => {
  if (phoneNum?.length === 12) {
    const str1 = phoneNum.slice(0, 2);
    const str2 = phoneNum.slice(2, 5);
    const str3 = phoneNum.slice(5, 8);
    const str4 = phoneNum.slice(8, 10);
    const str5 = phoneNum.slice(10, 12);
    return `${str1} ${str2} ${str3}-${str4}-${str5}`;
  }
  return phoneNum;
};
