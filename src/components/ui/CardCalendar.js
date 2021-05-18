import './CardCalendar.scss';
import PropTypes from 'prop-types';
import ButtonDots from './ButtonDots';
import Button from './Button';

/*TO DO*/
/*нужно будет добавить пропсы с функциями открытия для кнопок, 
уточнить запрос с апи как выглядит объект карточки, чтобы отредактировать поля*/

function CardCalendar({
  type,
  month,
  weekday,
  day,
  start,
  end,
  title,
  address,
  mentor,
  tel,
  placesLeft,
  isSelected,
  isDisabled,
}) {
  return (
    <article className={`calendar ${isSelected ? 'calendar_selected' : ''}`}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className="calendar__type">{type}</p>
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
              {start}–{end}
            </p>
          </li>
          <li className="calendar__info-item">
            <p className="calendar__place">{address}</p>
          </li>
          <li className="calendar__info-item">
            <p className="calendar__contact">
              {mentor}, {tel}
            </p>
          </li>
        </ul>
        <div className="calendar__submit">
          <Button
            title="Записаться"
            titleSelected="Отменить запись"
            color="blue"
            isSelected={isSelected}
            isDisabled={isDisabled}
          />
          <p className="calendar__place-left">
            {/* если запись закрыта, то карточка не должна быть выделенной */}
            {(isDisabled && 'Запись закрыта') || (!isSelected && `Осталось ${placesLeft} мест`)}
          </p>
          <ButtonDots />
        </div>
      </div>
    </article>
  );
}

CardCalendar.propTypes = {
  type: PropTypes.string,
  month: PropTypes.string,
  weekday: PropTypes.string,
  title: PropTypes.string,
  day: PropTypes.string,
  start: PropTypes.string,
  address: PropTypes.string,
  mentor: PropTypes.string,
  tel: PropTypes.string,
  placesLeft: PropTypes.number,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default CardCalendar;
