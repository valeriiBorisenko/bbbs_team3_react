import '../Popup/Popup.scss';
import './PopupAboutEvent.scss';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';
import { formatDate, formatWordCase, getCardType } from '../../utils/utils';

function PopupAboutEvent({
  isOpen,
  onClose,
  onEventSignUpClick,
  data: {
    title,
    description,
    address,
    // booked,
    contact,
    startAt,
    endAt,
    remainSeats,
    tags,
    setIsBooked,
    isBooked,
    isDisabled
  }
}) {
  const startDateParts = formatDate(startAt);
  const endDayParts = formatDate(endAt);

  function submitHandler(event) {
    if (isBooked) {
      event.preventDefault();
      setIsBooked(false);
      onClose();
    } else {
      event.preventDefault();
      onEventSignUpClick();
      setIsBooked(true);
    }
  }

  return (
    <Popup
      type="about-event"
      typeContainer="calendar"
      sectionClass={isBooked ? 'popup__container_booked' : ''}
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
            isBooked={isBooked}
            isDisabled={isDisabled}
          />
          <p className="calendar__place-left">
            {/* если запись закрыта, то карточка не должна быть выделенной */}
            {(isDisabled && 'Запись закрыта')
            || (!isBooked && `Осталось ${remainSeats} ${formatWordCase(remainSeats)}`)}
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
  data: PropTypes.objectOf(PropTypes.any)
};

PopupAboutEvent.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onEventSignUpClick: undefined,
  data: {}
};

export default PopupAboutEvent;