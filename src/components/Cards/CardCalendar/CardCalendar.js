import './CardCalendar.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import {
  changeCaseOfFirstLetter,
  formatDate,
  formatPhoneNumber,
  formatWordCase,
} from '../../../utils/utils';
import { Button, ButtonDots } from '../../utils/index';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStAfishaEvent } from '../../../config/constants';

function CardCalendar({
  cardData,
  onEventSignUpClick,
  onEventDescriptionClick,
  sectionClass,
}) {
  const {
    buttonTitle,
    buttonTitleSelected,
    buttonTitleDisabled,
    remainSeatsText,
    eventCanceled,
  } = texts;

  const {
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

  const renderPhone = () => (
    <a
      className={`calendar__phone ${
        canceled ? 'calendar__phone_canceled' : ''
      }`}
      href={`tel:${phoneNumber}`}
    >
      {formatPhoneNumber(phoneNumber)}
    </a>
  );

  const renderSubmitZone = () => {
    if (canceled)
      return <p className="calendar__text-canceled">{eventCanceled}</p>;
    return (
      <>
        <Button
          title={buttonTitle}
          titleSelected={buttonTitleSelected}
          color="blue"
          isDisabled={isDisabled}
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
  };

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
        <div className="calendar__submit">{renderSubmitZone()}</div>
      </div>
    </article>
  );
}

CardCalendar.propTypes = {
  cardData: PropTypes.objectOf(PropTypes.any),
  onEventSignUpClick: PropTypes.func,
  onEventDescriptionClick: PropTypes.func,
  sectionClass: PropTypes.string,
};

CardCalendar.defaultProps = {
  cardData: {},
  onEventSignUpClick: () => {},
  onEventDescriptionClick: () => {},
  sectionClass: '',
};

export default CardCalendar;
