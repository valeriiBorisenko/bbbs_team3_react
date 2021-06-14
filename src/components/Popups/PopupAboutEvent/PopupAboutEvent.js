import PropTypes from 'prop-types';
import {
  formatDate, formatWordCase, getCardType, Popup, Button, TitleH2
} from './index';

function PopupAboutEvent({
  isOpen,
  onClose,
  onEventSignUpClick,
  cardData
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
    description
  } = cardData;

  const startDateParts = formatDate(startAt);
  const endDayParts = formatDate(endAt);
  const isDisabled = (remainSeats < 1);

  function submitHandler(event) {
    event.preventDefault();
    onEventSignUpClick(cardData, cardData.booked);
  }

  return (
    <Popup
      type="about-event"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
    >
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
          <TitleH2
            title={title}
            sectionClass="calendar__title calendar__title_type_popup"
          />
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
        <div className="calendar__description">
          <p className="paragraph calendar__desc-paragraph">{description}</p>
        </div>
        <div className="calendar__submit">
          <Button
            color="blue"
            title="Записаться"
            titleSelected="Отменить запись"
            sectionClass="button_action_confirm"
            isSubmittable
            isBooked={booked}
            isDisabled={isDisabled}
          />
          <p className="calendar__place-left">
            {/* если запись закрыта, то карточка не должна быть выделенной */}
            {(isDisabled && 'Запись закрыта')
            || (!booked && `Осталось ${remainSeats} ${formatWordCase(remainSeats)}`)}
          </p>
        </div>
      </div>
    </Popup>
  );
}

PopupAboutEvent.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onEventSignUpClick: PropTypes.func,
  cardData: PropTypes.objectOf(PropTypes.any)
};

PopupAboutEvent.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onEventSignUpClick: () => {},
  cardData: {}
};

export default PopupAboutEvent;
