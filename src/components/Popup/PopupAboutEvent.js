import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';
import { formatDate } from '../../utils/utils';

function PopupAboutEvent({
  isOpen,
  onClose,
  onEventSignUpClick,
  data: {
    title,
    description,
    address,
    booked,
    contact,
    startAt,
    endAt,
    remainSeats,
    tags
  }
}) {
  //! временно
  console.log({
    title,
    description,
    address,
    booked,
    contact,
    startAt,
    endAt,
    remainSeats,
    tags
  });

  const startDateParts = formatDate(startAt);
  // console.log(startDateParts);
  const endDayParts = formatDate(endAt);

  function submitHandler(event) {
    event.preventDefault();
    onEventSignUpClick();
  }

  // волонтеры + дети
  function getCardType() {
    if (tags) {
      return tags.map((tag, idx) => {
        if (tags.length === 1) {
          return `${tag.name}`;
        }
        if (idx !== tags.length - 1) {
          return `${tag.name} + `;
        }
        return `${tag.name.toLowerCase()}`;
      });
    }
    return '';
  }

  // падеж слова
  function formatWordCase() {
    // если кончается на 1 - окончание О
    // если кончается на 2 3 4 - окончание A
    // если кончается на другое - окончания нет
    const lastDigit = remainSeats % 10;

    if (lastDigit === 1) {
      return 'место';
    }
    if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
      return 'местa';
    }
    return 'мест';
  }

  return (
    <Popup
      type="calendar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="calendar__caption">
        <div className="calendar__info">
          {/* заменить на пропс */}
          <p className="calendar__type">
            {getCardType()}
          </p>
          {/* заменить на пропс */}
          <p className="calendar__weekday">
            {`${startDateParts.month} / ${startDateParts.weekday}`}
          </p>
        </div>
        <div className="calendar__about">
          {/* заменить на пропс title */}
          <TitleH2
            title={title}
            sectionClass="calendar__title calendar__title_type_popup"
          />
          {/* заменить на пропс */}
          <p className="calendar__date">{startDateParts.day}</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            {/* заменить на пропс */}
            <p className="calendar__time">
              {`${startDateParts.hour}:${startDateParts.minutes} - ${endDayParts.hour}:${endDayParts.minutes}`}
            </p>
          </li>
          <li className="calendar__info-item">
            {/* заменить на пропс address */}
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
            sectionClass="button_action_confirm"
            onClick={submitHandler}
            isSubmittable
          />
          <p className="calendar__place-left">
            {`Осталось ${remainSeats} ${formatWordCase()}`}
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
  data: PropTypes.objectOf(PropTypes.string)
};

PopupAboutEvent.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onEventSignUpClick: undefined,
  data: PropTypes.objectOf(PropTypes.string)
};

export default PopupAboutEvent;
