import { months, weekdays } from './constants';

// форматирует секунды в часы, минуты и секунды, принимает на вход number
export const formatDuration = (duration) => {
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);

  if (minutes >= 60) {
    hours += 1;
    minutes -= 60;
  }

  if (seconds >= 60) {
    minutes += 1;
    seconds -= 60;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  hours = String(hours);
  minutes = String(minutes);
  seconds = String(seconds);

  return {
    hours,
    minutes,
    seconds
  };
};

// форматирует дату в объект по разным ключам, принимает на вход string вида "2021-05-08T21:22:00Z"
export const formatDate = (date) => {
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate());
  const weekdayName = weekdays[parsedDate.getDay()];
  const monthName = months[parsedDate.getMonth()];
  const hour = String(parsedDate.getHours());
  let minutes = parsedDate.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return {
    day,
    weekdayName,
    monthName,
    hour,
    minutes
  };
};

// падеж слова "место" в зависимости от числа мест
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