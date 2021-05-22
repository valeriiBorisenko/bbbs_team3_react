// форматирует секунды в часы, минуты и секунды
const formatDuration = (duration) => {
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

  return {
    hours,
    minutes,
    seconds
  };
};

export default formatDuration;
