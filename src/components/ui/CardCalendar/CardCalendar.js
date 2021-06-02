import './CardCalendar.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import ButtonDots from '../ButtonDots/ButtonDots';
import Button from '../Button/Button';
import { formatDate, formatWordCase, getCardType } from '../../../utils/utils';

/* TO DO */
/* нужно будет добавить пропсы с функциями открытия для кнопок */
/* Также понять, как лучше сделать закрытие записи - пропс isDisabled */

function CardCalendar({
  data: {
    address,
    contact,
    title,
    description,
    tags,
    startAt,
    endAt,
    remainSeats,
    booked
    // id
  },
  isModal,
  onEventSignUpClick,
  onEventFullDescriptionClick
}) {
  const startDateParts = formatDate(startAt);
  const endDayParts = formatDate(endAt);

  // записан ли ты на событие
  const [isBooked, setIsBooked] = useState(booked);

  const isDisabled = (remainSeats < 1);

  function prepareDataForConfirmationPopup() {
    onEventSignUpClick({
      tags,
      startAt,
      endAt,
      title,
      address,
      contact,
      remainSeats,
      description,
      isBooked,
      setIsBooked
    });
  }

  function prepareDataForAboutEventPopup() {
    onEventFullDescriptionClick({
      tags,
      startAt,
      endAt,
      title,
      address,
      contact,
      remainSeats,
      description,
      isBooked,
      setIsBooked,
      isDisabled
    });
  }

  function clickButton() {
    if (isBooked) {
      setIsBooked(false);
    } else {
      prepareDataForConfirmationPopup();
    }
  }

  /* //!если ответ сервера обновленный массив, то нам не нужны никакие isBooked и другие стейты,
  мы сменим состояние просто посмотрев на поле объекта */
  //! Если ответ сервера - "вы записались", то нужно вводить стейты и менять самим классы

  return (
    <article className={`calendar ${isBooked ? 'calendar_selected' : ''}`}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className="calendar__type">
            {getCardType(tags)}
          </p>
          <p className="calendar__weekday">
            {`${startDateParts.monthName} / ${startDateParts.weekdayName}`}
          </p>
        </div>
        <div className="calendar__about">
          <h2 className="section-title calendar__title">{title}</h2>
          <p className="calendar__date">{startDateParts.day}</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            <p className="calendar__time">
              {`${startDateParts.hour}:${startDateParts.minutes} - ${endDayParts.hour}:${endDayParts.minutes}`}
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
            onClick={clickButton}
            isBooked={isBooked}
            setIsBooked={setIsBooked}
          />
          <p className="calendar__place-left">
            {/* если запись закрыта, то карточка не должна быть выделенной */}
            {(isDisabled && 'Запись закрыта')
            || (!isBooked && `Осталось ${remainSeats} ${formatWordCase(remainSeats)}`)}
          </p>
          <ButtonDots
            handleClick={prepareDataForAboutEventPopup}
          />
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
  isModal: PropTypes.bool,
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func
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
  isModal: false,
  onEventSignUpClick: undefined,
  onEventFullDescriptionClick: undefined
};

export default CardCalendar;
