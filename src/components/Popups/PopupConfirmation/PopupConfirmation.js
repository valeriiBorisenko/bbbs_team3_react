import './PopupConfirmation.scss';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/utils';
import { Popup, Button, TitleH2 } from './index';
import { getLocalStorageData } from '../../../hooks/useLocalStorage';
import { useEventBooking } from '../../../hooks/index';
import { localStAfishaEvent } from '../../../config/constants';

function PopupConfirmation({ isOpen, onClose }) {
  const { registerOnEvent } = useEventBooking();
  const card = getLocalStorageData(localStAfishaEvent);

  const startDay = formatDate(card?.startAt);
  const endDay = formatDate(card?.endAt);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    registerOnEvent(card);
  };

  return (
    <Popup
      type="confirmation"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="popup__form" onSubmit={handleSubmit}>
        <p className="section-title popup__title_type_calendar">
          Подтвердить запись на мероприятие
        </p>
        <TitleH2
          sectionClass="popup__title_type_calendar"
          title={`«${card?.title}»`}
        />
        <TitleH2
          sectionClass="popup__title_type_calendar"
          title={`${startDay?.day} ${startDay?.monthName} с ${startDay?.hour}:${startDay?.minutes} - ${endDay?.hour}:${endDay?.minutes}`}
        />
        <div className="popup__buttons_type_calendar">
          <Button
            color="blue"
            title="Подтвердить запись"
            sectionClass="popup__button_type_calendar"
            isSubmittable
          />
          <Button color="black" title="Отменить" onClick={onClose} />
        </div>
      </form>
    </Popup>
  );
}

PopupConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupConfirmation.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupConfirmation;
