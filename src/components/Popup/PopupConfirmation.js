import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
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
    //! поработать над представлением даты в нормальном виде (startAt и endsAt)
    <Popup
      type="confirmation"
      isOpen={isOpen}
      onClose={onClose}
    >
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`Подтвердить запись на мероприятие «${title}» ${startDay.day} ${startDay.month} с ${startDay.hour}:${startDay.minutes} - ${endDay.hour}:${endDay.minutes}`}
      />
      <div className="popup__buttons_type_calendar">
        <Button
          color="blue"
          title="Подтвердить запись"
          sectionClass="button__calendar_type_confirm"
          onClick={submitHandler}
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
