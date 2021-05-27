import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupConfirmation({
  isOpen,
  onClose,
  onConfirmButtonClick,
  data: {
    title,
    startAt,
    endAt
  }
}) {
  function submitHandler(event) {
    event.preventDefault();
    onConfirmButtonClick();
  }
  return (
    //! поработать над представлением даты в нормальном виде (startAt и endsAt)
    <Popup
      type="confirmation"
      isOpen={isOpen}
      onClose={onClose}
    >
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`Подтвердить запись на мероприятие "${title}" ${startAt} ${endAt}`}
      />
      <div className="popup__buttons_type_calendar">
        <Button
          color="blue"
          title="Подтвердить запись"
          sectionClass="button__calendar_type_confirm"
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
