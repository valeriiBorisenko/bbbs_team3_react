import '../Popup/Popup.scss';
import './PopupConfirmation.scss';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';
import { formatDate } from '../../utils/utils';

function PopupConfirmation({
  isOpen,
  onClose,
  onConfirmButtonClick,
  data: {
    title,
    startAt,
    endAt,
    setIsBooked
  }
}) {
  const startDay = formatDate(startAt);
  const endDay = formatDate(endAt);

  const submitHandler = (event) => {
    event.preventDefault();
    onConfirmButtonClick();
    setIsBooked(true);
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
  data: PropTypes.objectOf(PropTypes.any)
};

PopupConfirmation.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onConfirmButtonClick: undefined,
  data: {}
};

export default PopupConfirmation;
