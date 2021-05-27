import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';
import { formatDate } from '../../utils/utils';

function PopupConfirmation({
  isOpen,
  onClose,
  onConfirmFormSubmit,
  data: {
    title,
    startAt,
    endAt
  },
  putBookedEvent
}) {
  const startDay = formatDate(startAt);
  const endDay = formatDate(endAt);

  const submitHandler = (event) => {
    event.preventDefault();
    onConfirmFormSubmit();
    putBookedEvent();
  };
  return (
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
  onConfirmFormSubmit: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  putBookedEvent: PropTypes.func
};

PopupConfirmation.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onConfirmFormSubmit: undefined,
  data: {},
  putBookedEvent: undefined
};

export default PopupConfirmation;
