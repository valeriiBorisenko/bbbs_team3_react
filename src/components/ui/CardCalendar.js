import './CardCalendar.scss';
import PropTypes from 'prop-types';
import ButtonDots from './ButtonDots';
import Button from './Button';

/*TO DO*/
/*нужно будет добавить пропсы с функциями открытия для кнопок*/
/*Также понять, как лучше сделать закрытие записи - пропс isDisabled*/

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
  isModal,
}) {
  return (
    <article className={`calendar ${isSelected ? 'calendar_selected' : ''}`}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className="calendar__type">{tag}</p>
          <p className="calendar__weekday">
            {month} / {weekday}
          </p>
        </div>
        <div className="calendar__about">
          <h2 className="calendar__title">{title}</h2>
          <p className="calendar__date">{day}</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            <p className="calendar__time">
              {startAt}–{endAt}
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
          <div class="calendar__description">
            <p class="calendar__desc-paragraph">{description}</p>
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
            {(isDisabled && 'Запись закрыта') ||
              (!isBooked && `Осталось ${remainSeats} мест`)}
          </p>
          <ButtonDots />
        </div>
      </div>
    </article>
  );
}

CardCalendar.propTypes = {
  tag: PropTypes.string,
  month: PropTypes.string,
  weekday: PropTypes.string,
  title: PropTypes.string,
  day: PropTypes.string,
  startAt: PropTypes.string,
  endAt: PropTypes.string,
  address: PropTypes.string,
  contact: PropTypes.string,
  remainSeats: PropTypes.number,
  description: PropTypes.string,
  isBooked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isModal: PropTypes.bool,
};

export default CardCalendar;
