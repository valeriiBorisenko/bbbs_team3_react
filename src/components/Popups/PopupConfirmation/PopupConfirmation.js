import './PopupConfirmation.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { formatDate } from '../../../utils/utils';
import { getLocalStorageData } from '../../../hooks/useLocalStorage';
import { useEventBooking } from '../../../hooks/index';
import { localStAfishaEvent } from '../../../config/constants';
import Popup from '../Popup/Popup';
import { Button, TitleH2 } from '../../utils/index';

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
          {texts.title}
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
            title={texts.submitButtonText}
            sectionClass="popup__button_type_calendar"
            isSubmittable
          />
          <Button
            color="black"
            title={texts.cancelButtonText}
            onClick={onClose}
          />
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
