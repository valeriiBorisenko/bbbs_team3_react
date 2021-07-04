import PropTypes from 'prop-types';
import {
  formatDate,
  formatWordCase,
  changeCaseOfFirstLetter,
} from '../../../utils/utils';
import { Popup, Button, TitleH2 } from './index';
import { getLocalStorageData } from '../../../hooks/useLocalStorage';
import { useEventBooking } from '../../../hooks/index';
import { localStAfishaEvent } from '../../../config/constants';

function PopupAboutEvent({ isOpen, onClose }) {
  const { handleEventBooking } = useEventBooking();
  const card = getLocalStorageData(localStAfishaEvent);

  const startDateParts = formatDate(card?.startAt);
  const endDayParts = formatDate(card?.endAt);
  const isDisabled = card?.remainSeats < 1;

  function handleSubmit(evt) {
    evt.preventDefault();
    handleEventBooking(card);
  }

  return (
    <Popup
      type="about-event"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="popup__form" onSubmit={handleSubmit}>
        <div className="calendar__caption">
          <div className="calendar__info">
            <p className="calendar__type">
              {changeCaseOfFirstLetter(card?.tags?.name)}
            </p>
            <p className="calendar__weekday">
              {`${startDateParts?.monthName} / ${startDateParts?.weekdayName}`}
            </p>
          </div>
          <div className="calendar__about">
            <TitleH2
              title={card?.title}
              sectionClass="calendar__title calendar__title_type_popup"
            />
            <p className="calendar__date">{startDateParts?.day}</p>
          </div>
        </div>
        <div className="calendar__meetup">
          <ul className="calendar__info-list">
            <li className="calendar__info-item">
              <p className="calendar__time">
                {`${startDateParts?.hour}:${startDateParts?.minutes} - ${endDayParts?.hour}:${endDayParts?.minutes}`}
              </p>
            </li>
            <li className="calendar__info-item">
              <p className="calendar__place">{card?.address}</p>
            </li>
            <li className="calendar__info-item">
              <p className="calendar__contact">{card?.contact}</p>
            </li>
          </ul>
          <div className="calendar__description">
            <p className="paragraph calendar__desc-paragraph">
              {card?.description}
            </p>
          </div>
          <div className="calendar__submit">
            <Button
              color="blue"
              title="Записаться"
              titleSelected="Отменить запись"
              sectionClass="button_action_confirm"
              isSubmittable
              isBooked={card?.booked}
              isDisabled={isDisabled}
            />
            <p className="calendar__place-left">
              {/* если запись закрыта, то карточка не должна быть выделенной */}
              {(isDisabled && 'Запись закрыта') ||
                (!card?.booked &&
                  `Осталось ${card?.remainSeats} ${formatWordCase(
                    card?.remainSeats
                  )}`)}
            </p>
          </div>
        </div>
      </form>
    </Popup>
  );
}

PopupAboutEvent.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupAboutEvent.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupAboutEvent;
