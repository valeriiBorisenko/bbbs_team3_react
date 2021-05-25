import { useState } from 'react';
import './CardCalendar.scss';
import PropTypes from 'prop-types';
import ButtonDots from '../ButtonDots/ButtonDots';
import Button from '../Button/Button';

/* TO DO */
/* нужно будет добавить пропсы с функциями открытия для кнопок */
/* Также понять, как лучше сделать закрытие записи - пропс isDisabled */

function CardCalendar({
  data: {
    tags,
    startAt,
    endAt,
    title,
    address,
    contact,
    remainSeats,
    description,
    booked
  },
  isModal
}) {
  const startDay = new Date(startAt);
  const endDay = new Date(endAt);
  const months = {
    0: 'январь',
    1: 'февраль',
    2: 'март',
    3: 'апрель',
    4: 'май',
    5: 'июнь',
    6: 'июль',
    7: 'август',
    8: 'сентябрь',
    9: 'октябрь',
    10: 'ноябрь',
    11: 'декабрь'
  };
  const weekdays = {
    0: 'воскресенье',
    1: 'понедельник',
    2: 'вторник',
    3: 'среда',
    4: 'четверг',
    5: 'пятница',
    6: 'суббота'
  };

  const [isBooked, setIsBooked] = useState(booked);

  function handleClickButtonBooked() {
    if (isBooked) setIsBooked(false);
    else setIsBooked(true);
  }

  const isDisabled = (remainSeats < 1 ? true : '');

  return (
    <article className={`calendar ${isBooked ? 'calendar_selected' : ''}`}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className="calendar__type">
            {tags.map((tag, idx) => {
              if (tags.length === 1) {
                return `${tag.name}`;
              }
              if (idx !== tags.length - 1) {
                return `${tag.name} + `;
              }
              return `${tag.name.toLowerCase()}`;
            })}
          </p>
          <p className="calendar__weekday">
            {`${months[startDay.getMonth()]} / ${weekdays[startDay.getDay()]}`}
          </p>
        </div>
        <div className="calendar__about">
          <h2 className="section-title calendar__title">{title}</h2>
          <p className="calendar__date">{startDay.getDate()}</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            <p className="calendar__time">
              {`${startDay.getHours()}:${startDay.getMinutes()} - ${endDay.getHours()}:${endDay.getMinutes()}`}
            </p>
          </li>
          <li className="calendar__info-item">
            <p className="calendar__place">{address}</p>
          </li>
          <li className="calendar__info-item">
            <p className="calendar__contact">{contact}</p>
          </li>
        </ul>
        {isModal && (
          <div className="calendar__description">
            <p className="calendar__desc-paragraph">{description}</p>
          </div>
        )}
        <div className="calendar__submit">
          <Button
            title="Записаться"
            titleSelected="Отменить запись"
            color="blue"
            isDisabled={isDisabled}
            onClick={handleClickButtonBooked}
          />
          <p className="calendar__place-left">
            {/* если запись закрыта, то карточка не должна быть выделенной */}
            {(isDisabled && 'Запись закрыта')
            || (!isBooked && `Осталось ${remainSeats} мест`)}
          </p>
          <ButtonDots />
        </div>
      </div>
    </article>
  );
}

CardCalendar.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  tags: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  startAt: PropTypes.string,
  endAt: PropTypes.string,
  address: PropTypes.string,
  contact: PropTypes.string,
  remainSeats: PropTypes.number,
  description: PropTypes.string,
  booked: PropTypes.bool,
  isModal: PropTypes.bool
};

CardCalendar.defaultProps = {
  data: {},
  title: '',
  startAt: '',
  endAt: '',
  address: '',
  contact: '',
  remainSeats: 0,
  tags: [],
  description: '',
  booked: false,
  isModal: false
};

export default CardCalendar;
