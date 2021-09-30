import PropTypes from 'prop-types';
import texts from './locales/RU';
import {
  changeCaseOfFirstLetter,
  formatDate,
  formatPhoneNumber,
  formatWordCase,
} from '../../../utils/utils';
import { Button, ButtonDots } from '../../utils';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStAfishaEvent } from '../../../config/constants';
import './CardCalendar.scss';

function CardCalendar({
  cardData,
  onEventSignUpClick,
  onEventDescriptionClick,
  sectionClass,
  isWaitingResponse,
  loadingEventId,
  isDescription,
}) {
  const {
    buttonTitle,
    buttonTitleSelected,
    buttonTitleDisabled,
    remainSeatsText,
    eventCanceled,
    buttonCancelLoading,
  } = texts;

  const {
    id,
    booked,
    tags,
    title,
    startAt,
    endAt,
    address,
    contact,
    remainSeats,
    phoneNumber,
    canceled,
  } = cardData;

  const startDateParts = formatDate(startAt);
  const endDayParts = formatDate(endAt);

  // будет ли заблокирована кнопка
  const isDisabled = (remainSeats < 1 && !booked) || canceled;
  const isCanceling = isWaitingResponse && booked && loadingEventId === id;

  function changeStateOfEvent() {
    setLocalStorageData(localStAfishaEvent, cardData);
    onEventSignUpClick(cardData);
  }

  function prepareDataForAboutEventPopup() {
    setLocalStorageData(localStAfishaEvent, cardData);
    onEventDescriptionClick();
  }

  const classNames = [
    'calendar',
    booked ? 'calendar_selected' : '',
    canceled ? 'calendar_canceled' : '',
    sectionClass,
  ]
    .join(' ')
    .trim();

  return (
    <article className={classNames}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p
            className={`calendar__type ${
              canceled ? 'calendar__type_canceled' : ''
            }`}
          >
            {changeCaseOfFirstLetter(tags?.name)}
          </p>
          <p
            className={`calendar__weekday ${
              canceled ? 'calendar__weekday_canceled' : ''
            }`}
          >
            {`${startDateParts.monthName} / ${startDateParts.weekdayName}`}
          </p>
        </div>
        <div className="calendar__about">
          <h2
            className={`section-title calendar__title ${
              canceled ? 'calendar__title_canceled' : ''
            }`}
          >
            {title}
          </h2>
          <p
            className={`calendar__date ${
              canceled ? 'calendar__date_canceled' : ''
            }`}
          >
            {startDateParts.day}
          </p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            <p
              className={`calendar__time ${
                canceled ? 'calendar__time_canceled' : ''
              }`}
            >
              {`${startDateParts.hour}:${startDateParts.minutes}–${endDayParts.hour}:${endDayParts.minutes}`}
            </p>
          </li>
          <li className="calendar__info-item">
            <p
              className={`calendar__place ${
                canceled ? 'calendar__place_canceled' : ''
              }`}
            >
              {address}
            </p>
          </li>
          <li className="calendar__info-item">
            <p
              className={`calendar__contact ${
                canceled ? 'calendar__contact_canceled' : ''
              }`}
            >
              {`${contact}, `}
              {renderPhone()}
            </p>
          </li>
        </ul>
        {isDescription && (
          <div className="calendar__description">
            <p className="paragraph calendar__desc-paragraph">
              {cardData?.description}
            </p>
          </div>
        )}
        <div className="calendar__submit">{renderSubmitZone()}</div>
      </div>
    </article>
  );

  function renderPhone() {
    return (
      <a
        className={`calendar__phone ${
          canceled ? 'calendar__phone_canceled' : ''
        }`}
        href={`tel:${phoneNumber}`}
      >
        {formatPhoneNumber(phoneNumber)}
      </a>
    );
  }

  function renderSubmitZone() {
    if (canceled)
      return <p className="calendar__text-canceled">{eventCanceled}</p>;

    return (
      <>
        <Button
          title={buttonTitle}
          titleSelected={
            isCanceling ? buttonCancelLoading : buttonTitleSelected
          }
          color="blue"
          isDisabled={isCanceling || isDisabled}
          onClick={changeStateOfEvent}
          isBooked={booked}
        />
        <p className="calendar__place-left">
          {/* если запись закрыта, то карточка не должна быть выделенной */}
          {(isDisabled && buttonTitleDisabled) ||
            (!booked &&
              `${remainSeatsText} ${remainSeats} ${formatWordCase(
                remainSeats
              )}`)}
        </p>
        <ButtonDots handleClick={prepareDataForAboutEventPopup} />
      </>
    );
  }
}

CardCalendar.propTypes = {
  cardData: PropTypes.objectOf(PropTypes.any),
  onEventSignUpClick: PropTypes.func,
  onEventDescriptionClick: PropTypes.func,
  sectionClass: PropTypes.string,
  isWaitingResponse: PropTypes.bool,
  loadingEventId: PropTypes.number,
  isDescription: PropTypes.bool,
};

CardCalendar.defaultProps = {
  cardData: {},
  onEventSignUpClick: () => {},
  onEventDescriptionClick: () => {},
  sectionClass: '',
  isWaitingResponse: false,
  loadingEventId: undefined,
  isDescription: false,
};

export default CardCalendar;
