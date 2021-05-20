import './CardCalendar.scss';
import PropTypes from 'prop-types';
import ButtonDots from '../ButtonDots/ButtonDots';
import Button from '../Button/Button';

/* TO DO */
/* нужно будет добавить пропсы с функциями открытия для кнопок */
/* Также понять, как лучше сделать закрытие записи - пропс isDisabled */

function CardCalendar({
  tag,
  month,
  weekday,
  day,
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
  return (
    <article className={`calendar ${isBooked ? 'calendar_selected' : ''}`}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className="calendar__type">{tag}</p>
          <p className="calendar__weekday">
            {month}
            {' / '}
            {weekday}
          </p>
        </div>
        <div className="calendar__about">
          <h2 className="section-title calendar__title">{title}</h2>
          <p className="calendar__date">{day}</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            <p className="calendar__time">
              {startAt}
              –
              {endAt}
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
  tag: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  weekday: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
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
