import './CardCalendar.scss';
import PropTypes from 'prop-types';
import ButtonDots from '../ButtonDots/ButtonDots';
import Button from '../Button/Button';
import { formatDate } from '../../../utils/utils';

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
  isModal,
  onClick,
  clickButton,
  isSelected
}) {
  const startDay = formatDate(startAt);
  const endDay = formatDate(endAt);

  const isDisabled = (remainSeats < 1 ? true : '');

  return (
    <article className={`calendar ${booked ? 'calendar_selected' : ''}`}>
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
            {`${startDay.month} / ${startDay.weekday}`}
          </p>
        </div>
        <div className="calendar__about">
          <h2 className="section-title calendar__title">{title}</h2>
          <p className="calendar__date">{startDay.day}</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            <p className="calendar__time">
              {`${startDay.hour}:${startDay.minutes} - ${endDay.hour}:${endDay.minutes}`}
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
            onClick={onClick}
            clickButton={clickButton}
            isSelected={isSelected}
            data={{ data: title, startAt, endAt }}
          />
          <p className="calendar__place-left">
            {/* если запись закрыта, то карточка не должна быть выделенной */}
            {(isDisabled && 'Запись закрыта')
            || (!booked && `Осталось ${remainSeats} мест`)}
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
  isModal: PropTypes.bool,
  onClick: PropTypes.func,
  clickButton: PropTypes.func,
  isSelected: PropTypes.bool
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
  isModal: false,
  onClick: undefined,
  clickButton: undefined,
  isSelected: false
};

export default CardCalendar;
