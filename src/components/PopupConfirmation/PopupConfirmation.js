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
    //! поработать над представлением даты в нормальном виде (startAt и endsAt)
    <Popup
      type="confirmation"
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="section-title popup__title_type_confirmation">Подтвердить запись на мероприятие</p>
      <TitleH2
        sectionClass="popup__title_type_confirmation"
        title={`«${title}»`}
      />
      <TitleH2
        sectionClass="popup__title_type_confirmation"
        title={`${startDay.day} ${startDay.monthName} с ${startDay.hour}:${startDay.minutes} - ${endDay.hour}:${endDay.minutes}`}
      />
      <div className="popup__buttons_type_confirmation">
        <Button
          color="blue"
          title="Подтвердить запись"
          sectionClass="button__popup_type_confirmation"
          onClick={submitHandler}
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
