import './CardCalendar.scss';
import PropTypes from 'prop-types';
import ButtonDots from '../ButtonDots/ButtonDots';
import Button from '../Button/Button';

/* TO DO */
/* нужно будет добавить пропсы с функциями открытия для кнопок */
/* Также понять, как лучше сделать закрытие записи - пропс isDisabled */

function CardCalendar({
  tags,
  startAt,
  endAt,
  title,
  address,
  contact,
  remainSeats,
  description,
  isBooked,
  isDisabled,
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
  return (
    <article className={`calendar ${isBooked ? 'calendar_selected' : ''}`}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className="calendar__type">
            {tags.map((tag, idx) => {
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
            isSelected={isBooked}
            isDisabled={isDisabled}
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
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  startAt: PropTypes.string.isRequired,
  endAt: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  remainSeats: PropTypes.number.isRequired,
  description: PropTypes.string,
  isBooked: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  isModal: PropTypes.bool.isRequired
};

CardCalendar.defaultProps = {
  isDisabled: false,
  description: ''
};

export default CardCalendar;
