import PropTypes from 'prop-types';
import texts from './locales/RU';
import {
  changeCaseOfFirstLetter,
  formatDate,
  formatPhoneNumber,
  formatWordCase,
} from '../../../utils/utils';
import '../../Cards/CardCalendar/CardCalendar.scss';
import Popup from '../Popup/Popup';
import { Button, Heading, ModificatedScrollbars } from '../../utils';
import { getLocalStorageData } from '../../../hooks/useLocalStorage';
import { useEventBooking } from '../../../hooks';
import { localStAfishaEvent } from '../../../config/constants';

function PopupAboutEvent({ isWithoutRegister, isOpen, onClose }) {
  const {
    buttonTitle,
    buttonTitleSelected,
    buttonTitleDisabled,
    remainSeatsText,
    buttonCancelLoading,
    buttonTitleLoading,
  } = texts;

  const { handleEventBooking, isWaitingResponse } = useEventBooking();
  const card = getLocalStorageData(localStAfishaEvent);

  const startDateParts = formatDate(card?.startAt);
  const endDayParts = formatDate(card?.endAt);
  const isDisabled = card?.remainSeats < 1 && !card?.booked;
  const isCanceling = isWaitingResponse && card?.booked;
  const isRegistering = isWaitingResponse && !card?.booked;

  function handleSubmit(evt) {
    evt.preventDefault();
    // передаем карточку и сообщаем функции, что запись без подтверждения
    handleEventBooking(card, true);
  }

  return (
    <Popup
      type="about-event"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
    >
      {card && (
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
            <div className="calendar__about calendar__about_modal">
              <Heading
                level={2}
                type="small"
                content={card?.title}
                sectionClass="calendar__title calendar__title_type_popup"
              />
              <p className="calendar__date">{startDateParts?.day}</p>
            </div>
          </div>
          <div className="calendar__meetup">
            <ul className="calendar__info-list">
              <li className="calendar__info-item">
                <p className="calendar__time">
                  {`${startDateParts?.hour}:${startDateParts?.minutes}–${endDayParts?.hour}:${endDayParts?.minutes}`}
                </p>
              </li>
              <li className="calendar__info-item">
                <p className="calendar__place">{card?.address}</p>
              </li>
              <li className="calendar__info-item">
                <p className="calendar__contact">
                  {`${card?.contact}, `}
                  {renderPhone()}
                </p>
              </li>
            </ul>
            <div className="calendar__description">
              <ModificatedScrollbars horizontalScrollClass="scroll-thumb">
                <p className="paragraph calendar__desc-paragraph">
                  {card?.description}
                </p>
              </ModificatedScrollbars>
            </div>

            {!isWithoutRegister && (
              <div className="calendar__submit">
                <Button
                  color="blue"
                  title={isRegistering ? buttonTitleLoading : buttonTitle}
                  titleSelected={
                    isCanceling ? buttonCancelLoading : buttonTitleSelected
                  }
                  sectionClass="button_action_confirm"
                  isSubmittable
                  isBooked={card?.booked}
                  isDisabled={isCanceling || isRegistering || isDisabled}
                />
                <p className="calendar__place-left">
                  {(isDisabled && buttonTitleDisabled) ||
                    (!card?.booked &&
                      `${remainSeatsText} ${card?.remainSeats} ${formatWordCase(
                        card?.remainSeats
                      )}`)}
                </p>
              </div>
            )}
          </div>
        </form>
      )}
    </Popup>
  );

  function renderPhone() {
    return (
      <a className="calendar__phone" href={`tel:${card?.phoneNumber}`}>
        {formatPhoneNumber(card?.phoneNumber)}
      </a>
    );
  }
}

PopupAboutEvent.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isWithoutRegister: PropTypes.bool,
};

PopupAboutEvent.defaultProps = {
  isOpen: false,
  onClose: () => {},
  isWithoutRegister: false,
};

export default PopupAboutEvent;
