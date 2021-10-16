import PropTypes from 'prop-types';
import texts from './locales/RU';
import { formatDate, formatMonthsGenitiveCase } from '../../../utils/utils';
import { getLocalStorageData } from '../../../hooks/useLocalStorage';
import { useEventBooking } from '../../../hooks';
import { localStAfishaEvent } from '../../../config/constants';
import Popup from '../Popup/Popup';
import { Button, Heading } from '../../utils';
import './PopupConfirmation.scss';

function PopupConfirmation({ isOpen, onClose }) {
  const { registerOnEvent, isWaitingResponse } = useEventBooking();
  const card = getLocalStorageData(localStAfishaEvent);

  const startDay = formatDate(card?.startAt);
  const endDay = formatDate(card?.endAt);
  const month = formatMonthsGenitiveCase(startDay?.monthName);

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
        <Heading
          level={2}
          type="small"
          sectionClass="popup__title_type_calendar"
          content={`«${card?.title}»`}
        />
        <Heading
          level={2}
          type="small"
          sectionClass="popup__title_type_calendar"
          content={`${parseInt(startDay?.day, 10)} ${month} с ${
            startDay?.hour
          }:${startDay?.minutes}—${endDay?.hour}:${endDay?.minutes}`}
        />
        <div className="popup__buttons_type_calendar">
          <Button
            color="blue"
            title={
              isWaitingResponse
                ? texts.submitButtonTextLoading
                : texts.submitButtonText
            }
            sectionClass="popup__button_type_calendar"
            isDisabled={isWaitingResponse}
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
