import './CardCalendar.scss';
import PropTypes from 'prop-types';
import { formatDate, formatWordCase, getCardType } from '../../../utils/utils';
import { ButtonDots, Button } from './index';

function CardCalendar({
  cardData,
  isModal,
  onEventSignUpClick,
  onEventFullDescriptionClick,
  sectionClass,
}) {
  const {
    booked,
    tags,
    title,
    startAt,
    endAt,
    address,
    contact,
    remainSeats,
    description,
  } = cardData;

  const startDateParts = formatDate(startAt);
  const endDayParts = formatDate(endAt);

  // будет ли заблокирована кнопка
  const isDisabled = remainSeats < 1;

  function prepareDataForConfirmationPopup() {
    onEventSignUpClick(cardData);
  }

  function prepareDataForAboutEventPopup() {
    onEventFullDescriptionClick(cardData, cardData.booked);
  }

  const classNames = [
    'calendar',
    booked ? 'calendar_selected' : '',
    sectionClass,
  ]
    .join(' ')
    .trim();

  return (
    <article className={classNames}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className="calendar__type">{getCardType(tags)}</p>
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
            onClick={prepareDataForConfirmationPopup}
            isBooked={booked}
          />
          <p className="calendar__place-left">
            {/* если запись закрыта, то карточка не должна быть выделенной */}
            {(isDisabled && 'Запись закрыта') ||
              (!booked &&
                `Осталось ${remainSeats} ${formatWordCase(remainSeats)}`)}
          </p>
          <ButtonDots handleClick={prepareDataForAboutEventPopup} />
        </div>
      </div>
    </article>
  );
}

CardCalendar.propTypes = {
  cardData: PropTypes.objectOf(PropTypes.any),
  isModal: PropTypes.bool,
  onEventSignUpClick: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func,
  sectionClass: PropTypes.string,
};

CardCalendar.defaultProps = {
  cardData: {},
  isModal: false,
  onEventSignUpClick: () => {},
  onEventFullDescriptionClick: () => {},
  sectionClass: '',
};

export default CardCalendar;
