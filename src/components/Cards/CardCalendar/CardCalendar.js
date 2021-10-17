import PropTypes from 'prop-types';
import texts from './locales/RU';
import {
  changeCaseOfFirstLetter,
  formatDate,
  formatPhoneNumber,
  formatWordCase,
  refineClassNames,
} from '../../../utils/utils';
import { Button, ButtonDots, Heading, Paragraph } from '../../utils';
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

  const classNames = {
    main: refineClassNames([
      'calendar',
      booked ? 'calendar_selected' : '',
      canceled ? 'calendar_canceled' : '',
      sectionClass,
    ]),
    tags: refineClassNames([
      'calendar__type',
      canceled ? 'calendar__type_canceled' : '',
    ]),
    weekday: refineClassNames([
      'calendar__weekday',
      canceled ? 'calendar__weekday_canceled' : '',
    ]),
    title: refineClassNames([
      'calendar__title',
      canceled ? 'calendar__title_canceled' : '',
    ]),
    date: refineClassNames([
      'calendar__date',
      canceled ? 'calendar__date_canceled' : '',
    ]),
    time: refineClassNames([
      'calendar__time',
      canceled ? 'calendar__time_canceled' : '',
    ]),
    place: refineClassNames([
      'calendar__place',
      canceled ? 'calendar__place_canceled' : '',
    ]),
    contact: refineClassNames([
      'calendar__contact',
      canceled ? 'calendar__contact_canceled' : '',
    ]),
    phone: refineClassNames([
      'calendar__phone',
      canceled ? 'calendar__phone_canceled' : '',
    ]),
  };

  return (
    <article className={classNames.main}>
      <div className="calendar__caption">
        <div className="calendar__info">
          <p className={classNames.tags}>
            {changeCaseOfFirstLetter(tags?.name)}
          </p>
          <p className={classNames.weekday}>
            {`${startDateParts.monthName} / ${startDateParts.weekdayName}`}
          </p>
        </div>
        <div className="calendar__about">
          <Heading
            level={2}
            type="small"
            content={title}
            sectionClass={classNames.title}
          />
          <p className={classNames.date}>{startDateParts.day}</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            <p className={classNames.time}>
              {`${startDateParts.hour}:${startDateParts.minutes}–${endDayParts.hour}:${endDayParts.minutes}`}
            </p>
          </li>
          <li className="calendar__info-item">
            <p className={classNames.place}>{address}</p>
          </li>
          <li className="calendar__info-item">
            <p className={classNames.contact}>
              {`${contact}, `}
              {renderPhone()}
            </p>
          </li>
        </ul>
        {isDescription && (
          <div className="calendar__description">
            <Paragraph
              content={cardData?.description}
              sectionClass="calendar__desc-paragraph"
            />
          </div>
        )}
        <div className="calendar__submit">{renderSubmitZone()}</div>
      </div>
    </article>
  );

  function renderPhone() {
    return (
      <a className={classNames.phone} href={`tel:${phoneNumber}`}>
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
