import './PopupConfirmation.scss';
import PropTypes from 'prop-types';
import {
  formatDate, Popup, Button, TitleH2
} from './index';

function PopupConfirmation({
  isOpen,
  onClose,
  onConfirmButtonClick,
  cardData
}) {
  const { title, startAt, endAt } = cardData;
  const startDay = formatDate(startAt);
  const endDay = formatDate(endAt);

  const submitHandler = (event) => {
    event.preventDefault();
    onConfirmButtonClick(cardData);
  };

  return (
    <Popup
      type="confirmation"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
    >
      <p className="section-title popup__title_type_calendar">Подтвердить запись на мероприятие</p>
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`«${title}»`}
      />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`${startDay.day} ${startDay.monthName} с ${startDay.hour}:${startDay.minutes} - ${endDay.hour}:${endDay.minutes}`}
      />
      <div className="popup__buttons_type_calendar">
        <Button
          color="blue"
          title="Подтвердить запись"
          sectionClass="popup__button_type_calendar"
          isSubmittable
        />
        <Button
          color="black"
          title="Отменить"
          onClick={onClose}
        />
      </div>
    </Popup>
  );
}

PopupConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirmButtonClick: PropTypes.func,
  cardData: PropTypes.objectOf(PropTypes.any)
};

PopupConfirmation.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onConfirmButtonClick: () => {},
  cardData: {}
};

export default PopupConfirmation;
